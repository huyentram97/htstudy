import { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Typography, Button, Spin, Empty } from 'antd';
import { BookOutlined, NumberOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api';

const { Title, Text } = Typography;

function ExamsPage() {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/flashcards/sets').then((res) => {
      setFlashcardSets(res.data.data || []);
    }).catch(() => setFlashcardSets([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Title level={3}>Luyện đề (Flashcard)</Title>
      <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
        Lật thẻ để ôn tập: mặt trước là câu hỏi, mặt sau là đáp án.
      </Text>

      {flashcardSets.length === 0 ? (
        <Empty description="Chưa có bộ đề flashcard nào." />
      ) : (
        <Row gutter={[16, 16]}>
          {flashcardSets.map((set) => (
            <Col xs={24} sm={12} md={8} key={set.id}>
              <Card hoverable onClick={() => navigate(`/exams/flashcard/${set.id}`)}>
                <Title level={5}><BookOutlined /> {set.title}</Title>
                <Text type="secondary">{set.description}</Text>
                <div style={{ marginTop: 12 }}>
                  <Tag color="blue"><NumberOutlined /> {set.cardCount || set.card_count} thẻ</Tag>
                </div>
                <Button type="primary" block style={{ marginTop: 12 }}>Bắt đầu ôn tập</Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ExamsPage;
