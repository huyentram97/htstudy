import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spin, Space, Tag } from 'antd';
import { ArrowLeftOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { apiClient } from '../../api';

const { Title, Paragraph, Text } = Typography;

function LessonViewerPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    apiClient.get(`/lessons/${lessonId}`).then((res) => {
      setLesson(res.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [lessonId]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  // Extract text content
  let contentText = '';
  if (lesson?.content) {
    try {
      const parsed = typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content;
      contentText = parsed.text || '';
    } catch {
      contentText = String(lesson?.content || '');
    }
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/courses/${courseId}`)}>Quay lại khóa</Button>
      </Space>

      <Card>
        <Tag color="blue">{lesson?.contentType || 'text'}</Tag>
        <Title level={4} style={{ marginTop: 8 }}>{lesson?.title || 'Bài học'}</Title>

        <div style={{ marginTop: 24, fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap', maxHeight: '70vh', overflow: 'auto' }}>
          {contentText ? (
            <Paragraph>{contentText}</Paragraph>
          ) : (
            <Text type="secondary">Bài học này chưa có nội dung chi tiết.</Text>
          )}
        </div>
      </Card>
    </div>
  );
}

export default LessonViewerPage;
