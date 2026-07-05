import { Row, Col, Card, Tag, Typography, Button, Progress, Select, Tabs } from 'antd';
import { FileTextOutlined, ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ExamsPage() {
  const exams = [
    { id: '1', title: 'Đề thi Kế toán tài chính - Đề 1', subject: 'Kế toán', questions: 40, duration: 60, attempts: 2, bestScore: 85, accessType: 'free' },
    { id: '2', title: 'Đề thi Kiểm toán nội bộ - Đề 1', subject: 'Kiểm toán', questions: 30, duration: 45, attempts: 1, bestScore: 72, accessType: 'free' },
    { id: '3', title: 'Đề thi Thuế TNDN nâng cao', subject: 'Thuế', questions: 50, duration: 90, attempts: 0, bestScore: null, accessType: 'locked' },
    { id: '4', title: 'Đề thi CPA Module 1', subject: 'CPA', questions: 60, duration: 120, attempts: 0, bestScore: null, accessType: 'premium' },
    { id: '5', title: 'Đề thi Kế toán quản trị', subject: 'Kế toán', questions: 35, duration: 50, attempts: 3, bestScore: 92, accessType: 'free' },
    { id: '6', title: 'Đề thi IFRS Foundation', subject: 'Kế toán', questions: 45, duration: 75, attempts: 0, bestScore: null, accessType: 'locked' },
  ];

  const flashcardSets = [
    { id: '1', title: 'Thuật ngữ Kế toán', cards: 50, known: 35, review: 15 },
    { id: '2', title: 'Chuẩn mực VAS', cards: 30, known: 12, review: 18 },
    { id: '3', title: 'Công thức Tài chính', cards: 25, known: 20, review: 5 },
  ];

  const tabItems = [
    {
      key: 'exams',
      label: 'Luyện đề',
      children: (
        <div>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={12} sm={6}>
              <Select placeholder="Môn học" style={{ width: '100%' }} allowClear>
                <Select.Option value="accounting">Kế toán</Select.Option>
                <Select.Option value="audit">Kiểm toán</Select.Option>
                <Select.Option value="tax">Thuế</Select.Option>
                <Select.Option value="cpa">CPA</Select.Option>
              </Select>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            {exams.map((exam) => (
              <Col xs={24} sm={12} md={8} key={exam.id}>
                <Card hoverable>
                  <div style={{ marginBottom: 12 }}>
                    <Tag color="blue">{exam.subject}</Tag>
                    {exam.accessType === 'premium' && <Tag color="gold">Premium</Tag>}
                    {exam.accessType === 'locked' && <Tag color="red">🔒 200 điểm</Tag>}
                  </div>
                  <Title level={5} style={{ marginBottom: 8 }}>{exam.title}</Title>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 12, color: '#666' }}>
                    <span><FileTextOutlined /> {exam.questions} câu</span>
                    <span><ClockCircleOutlined /> {exam.duration} phút</span>
                  </div>
                  {exam.bestScore !== null && (
                    <div style={{ marginBottom: 12 }}>
                      <Text type="secondary">Điểm cao nhất: </Text>
                      <Text strong style={{ color: exam.bestScore >= 80 ? '#52c41a' : '#faad14' }}>
                        <TrophyOutlined /> {exam.bestScore}%
                      </Text>
                      <Text type="secondary"> ({exam.attempts} lượt)</Text>
                    </div>
                  )}
                  {exam.accessType === 'free' ? (
                    <Button type="primary" block>{exam.attempts > 0 ? 'Làm lại' : 'Bắt đầu'}</Button>
                  ) : (
                    <Button block disabled={exam.accessType === 'locked'}>
                      {exam.accessType === 'locked' ? '🔒 Mở khóa' : 'Premium'}
                    </Button>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ),
    },
    {
      key: 'flashcards',
      label: 'Flashcard',
      children: (
        <Row gutter={[16, 16]}>
          {flashcardSets.map((set) => (
            <Col xs={24} sm={12} md={8} key={set.id}>
              <Card hoverable>
                <Title level={5}>{set.title}</Title>
                <div style={{ marginBottom: 12 }}>
                  <Text type="secondary">{set.cards} thẻ</Text>
                </div>
                <Progress
                  percent={Math.round((set.known / set.cards) * 100)}
                  success={{ percent: Math.round((set.known / set.cards) * 100) }}
                  format={() => `${set.known}/${set.cards} đã thuộc`}
                />
                <Button type="primary" block style={{ marginTop: 12 }}>Ôn tập</Button>
              </Card>
            </Col>
          ))}
        </Row>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Luyện đề & Flashcard</Title>
      <Tabs items={tabItems} defaultActiveKey="exams" />
    </div>
  );
}

export default ExamsPage;
