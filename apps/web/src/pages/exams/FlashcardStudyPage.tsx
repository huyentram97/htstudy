import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spin, Space, Tag, Progress } from 'antd';
import { ArrowLeftOutlined, LeftOutlined, RightOutlined, EyeOutlined, CheckOutlined, ReloadOutlined } from '@ant-design/icons';
import { apiClient } from '../../api';

const { Title, Text, Paragraph } = Typography;

function FlashcardStudyPage() {
  const { setId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [known, setKnown] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!setId) return;
    apiClient.get(`/flashcards/sets/${setId}/cards`).then((res) => {
      setCards(res.data.data || []);
    }).catch(() => setCards([])).finally(() => setLoading(false));
  }, [setId]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (cards.length === 0) return <Card><Text type="secondary">Bộ flashcard này chưa có thẻ nào.</Text></Card>;

  const card = cards[currentIdx];
  const progress = Math.round(((currentIdx + 1) / cards.length) * 100);

  const markKnown = () => {
    setKnown(new Set([...known, currentIdx]));
    goNext();
  };

  const goNext = () => {
    setFlipped(false);
    if (currentIdx < cards.length - 1) setCurrentIdx(currentIdx + 1);
  };

  const goPrev = () => {
    setFlipped(false);
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/exams')}>Quay lại</Button>
        <Tag color="blue">{currentIdx + 1} / {cards.length}</Tag>
        <Tag color="green">Đã thuộc: {known.size}</Tag>
      </Space>

      <Progress percent={progress} showInfo={false} style={{ marginBottom: 16 }} />

      {/* Flashcard */}
      <Card
        onClick={() => setFlipped(!flipped)}
        style={{
          minHeight: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: flipped ? '#f6ffed' : '#fff',
          border: flipped ? '2px solid #52c41a' : '1px solid #d9d9d9',
          transition: 'all 0.3s',
        }}
        bodyStyle={{ width: '100%', textAlign: 'center', padding: 32 }}
      >
        {!flipped ? (
          <div>
            <Tag color="blue" style={{ marginBottom: 16 }}>Câu hỏi</Tag>
            <Paragraph style={{ fontSize: 16, whiteSpace: 'pre-wrap' }}>{card.frontContent || card.front_content}</Paragraph>
            <Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
              <EyeOutlined /> Click để xem đáp án
            </Text>
          </div>
        ) : (
          <div>
            <Tag color="green" style={{ marginBottom: 16 }}>Đáp án</Tag>
            <Paragraph style={{ fontSize: 16, whiteSpace: 'pre-wrap', color: '#389e0d' }}>{card.backContent || card.back_content}</Paragraph>
          </div>
        )}
      </Card>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <Button icon={<LeftOutlined />} onClick={goPrev} disabled={currentIdx === 0}>Trước</Button>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => setFlipped(!flipped)}>Lật thẻ</Button>
          <Button type="primary" icon={<CheckOutlined />} onClick={markKnown} style={{ background: '#52c41a', borderColor: '#52c41a' }}>Đã thuộc</Button>
        </Space>
        <Button icon={<RightOutlined />} onClick={goNext} disabled={currentIdx === cards.length - 1}>Tiếp</Button>
      </div>
    </div>
  );
}

export default FlashcardStudyPage;
