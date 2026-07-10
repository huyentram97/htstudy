import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Tag, Spin, List, Row, Col, Collapse } from 'antd';
import { PlayCircleOutlined, BookOutlined, ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import { apiClient } from '../../api';

const { Title, Text, Paragraph } = Typography;

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const courseRes = await apiClient.get(`/courses/${id}`);
        setCourse(courseRes.data.data);
        // Try to get chapters
        try {
          const chaptersRes = await apiClient.get(`/courses/${id}/chapters`);
          setChapters(chaptersRes.data.data || []);
        } catch {}
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!course) return <Text type="danger">Khóa học không tồn tại.</Text>;

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/courses')} style={{ marginBottom: 16 }}>
        Quay lại
      </Button>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Tag color="blue">{course.accessType === 'free' ? 'Miễn phí' : course.accessType}</Tag>
            <Title level={3} style={{ marginTop: 8 }}>{course.title}</Title>
            <Paragraph type="secondary">{course.description || 'Chưa có mô tả.'}</Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'center', paddingTop: 20 }}>
            <BookOutlined style={{ fontSize: 64, color: '#1677ff' }} />
          </Col>
        </Row>
      </Card>

      {/* Chapters with lessons */}
      <Card title={`Nội dung khóa học (${chapters.length} chương)`}>
        {chapters.length > 0 ? (
          <Collapse accordion items={chapters.map((ch: any, idx: number) => ({
            key: ch.id,
            label: <Text strong>Chương {idx + 1}: {ch.title}</Text>,
            extra: ch.description && <Text type="secondary" style={{ fontSize: 12 }}>{ch.description}</Text>,
            children: ch.lessons?.length > 0 ? (
              <List
                dataSource={ch.lessons}
                renderItem={(lesson: any, lessonIdx: number) => (
                  <List.Item actions={[
                    <Button type="primary" size="small" onClick={() => navigate(`/courses/${id}/lessons/${lesson.id}`)}>
                      <PlayCircleOutlined /> Học
                    </Button>
                  ]}>
                    <List.Item.Meta
                      avatar={<Tag color="blue">{lessonIdx + 1}</Tag>}
                      title={lesson.title}
                      description={<Tag><FileTextOutlined /> {lesson.contentType || 'text'}</Tag>}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">Chương này chưa có bài học.</Text>
            ),
          }))} />
        ) : (
          <Text type="secondary">Đang cập nhật nội dung khóa học...</Text>
        )}
      </Card>
    </div>
  );
}

export default CourseDetailPage;
