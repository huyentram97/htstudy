import { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Typography, Button, Spin } from 'antd';
import { FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api';

const { Title, Text } = Typography;

function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/exams').then((res) => {
      setExams(res.data.data || []);
    }).catch(() => setExams([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Title level={3}>Luyện đề</Title>

      {exams.length === 0 && (
        <Card>
          <Text type="secondary">Chưa có đề thi nào. Vui lòng chờ Admin tạo đề từ ngân hàng câu hỏi.</Text>
        </Card>
      )}

      <Row gutter={[16, 16]}>
        {exams.map((exam) => (
          <Col xs={24} sm={12} md={8} key={exam.id}>
            <Card hoverable>
              <Title level={5}>{exam.title}</Title>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12, color: '#666' }}>
                <span><FileTextOutlined /> {exam.questionCount} câu</span>
                <span><ClockCircleOutlined /> {exam.timeLimitMinutes} phút</span>
              </div>
              <Tag color={exam.accessType === 'free' ? 'green' : 'red'}>{exam.accessType === 'free' ? 'Miễn phí' : 'Khóa'}</Tag>
              <Button type="primary" block style={{ marginTop: 12 }} onClick={() => navigate(`/exams/${exam.id}/take`)}>
                Bắt đầu làm bài
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ExamsPage;
