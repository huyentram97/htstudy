import { useState, useEffect } from 'react';
import { Card, Radio, Checkbox, Button, Typography, Progress, Space, Tag, Modal, Result } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ExamTakingPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const exam = {
    title: 'Đề thi Kế toán tài chính - Đề 1',
    timeLimit: 60,
    questions: [
      { id: 1, type: 'single', content: 'Phương trình kế toán cơ bản là gì?', options: ['Tài sản = Nợ phải trả + Vốn chủ sở hữu', 'Tài sản = Nợ phải trả - Vốn chủ sở hữu', 'Tài sản + Nợ phải trả = Vốn chủ sở hữu', 'Tài sản - Vốn chủ sở hữu = Nợ phải trả'], correct: '0' },
      { id: 2, type: 'single', content: 'Báo cáo kết quả kinh doanh phản ánh điều gì?', options: ['Tình hình tài chính tại một thời điểm', 'Kết quả hoạt động trong một kỳ', 'Lưu chuyển tiền tệ', 'Thay đổi vốn chủ sở hữu'], correct: '1' },
      { id: 3, type: 'single', content: 'Lợi nhuận gộp được tính bằng công thức nào?', options: ['Doanh thu - Chi phí', 'Doanh thu thuần - Giá vốn hàng bán', 'Doanh thu - Thuế', 'Lợi nhuận ròng + Chi phí'], correct: '1' },
      { id: 4, type: 'single', content: 'Nguyên tắc kế toán nào yêu cầu ghi nhận chi phí cùng kỳ với doanh thu liên quan?', options: ['Nguyên tắc thận trọng', 'Nguyên tắc phù hợp', 'Nguyên tắc nhất quán', 'Nguyên tắc trọng yếu'], correct: '1' },
      { id: 5, type: 'single', content: 'Tài sản ngắn hạn bao gồm?', options: ['Nhà xưởng, máy móc', 'Tiền mặt, hàng tồn kho, phải thu', 'Đất đai, bằng sáng chế', 'Vốn góp cổ đông'], correct: '1' },
    ],
  };

  // Timer
  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) { handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionIdx: number, value: string) => {
    setAnswers({ ...answers, [questionIdx]: [value] });
  };

  const handleSubmit = () => {
    let correct = 0;
    exam.questions.forEach((q, idx) => {
      if (answers[idx]?.[0] === q.correct) correct++;
    });
    setScore(Math.round((correct / exam.questions.length) * 100));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card>
        <Result
          status={score >= 60 ? 'success' : 'warning'}
          title={score >= 60 ? 'Chúc mừng! Bạn đã đạt!' : 'Chưa đạt — cố gắng lần sau!'}
          subTitle={`Điểm: ${score}% (${Math.round(score * exam.questions.length / 100)}/${exam.questions.length} câu đúng)`}
          extra={[
            <Button type="primary" key="review">Xem đáp án</Button>,
            <Button key="retry">Làm lại</Button>,
          ]}
        />
      </Card>
    );
  }

  const question = exam.questions[currentQuestion];

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>{exam.title}</Title>
          <Tag color={timeLeft < 300 ? 'red' : 'blue'} style={{ fontSize: 16, padding: '4px 12px' }}>
            <ClockCircleOutlined /> {formatTime(timeLeft)}
          </Tag>
        </div>
        <Progress percent={Math.round(((currentQuestion + 1) / exam.questions.length) * 100)} showInfo={false} style={{ marginTop: 8 }} />
      </Card>

      {/* Question */}
      <Card style={{ marginBottom: 16, minHeight: 300 }}>
        <Tag color="purple">Câu {currentQuestion + 1}/{exam.questions.length}</Tag>
        <Title level={5} style={{ marginTop: 12 }}>{question.content}</Title>
        <Radio.Group
          style={{ width: '100%', marginTop: 16 }}
          value={answers[currentQuestion]?.[0]}
          onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {question.options.map((opt, idx) => (
              <Radio key={idx} value={String(idx)} style={{ padding: '12px 16px', border: '1px solid #f0f0f0', borderRadius: 8, width: '100%' }}>
                {opt}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Card>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(currentQuestion - 1)}>Câu trước</Button>
        <Space>
          {exam.questions.map((_, idx) => (
            <Button key={idx} size="small" type={answers[idx] ? 'primary' : 'default'} onClick={() => setCurrentQuestion(idx)}>
              {idx + 1}
            </Button>
          ))}
        </Space>
        {currentQuestion < exam.questions.length - 1 ? (
          <Button type="primary" onClick={() => setCurrentQuestion(currentQuestion + 1)}>Câu tiếp</Button>
        ) : (
          <Button type="primary" danger onClick={() => Modal.confirm({ title: 'Nộp bài?', content: `Bạn đã trả lời ${Object.keys(answers).length}/${exam.questions.length} câu.`, onOk: handleSubmit })}>
            Nộp bài
          </Button>
        )}
      </div>
    </div>
  );
}

export default ExamTakingPage;
