import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Tag, Spin, List, Row, Col } from 'antd';
import { PlayCircleOutlined, BookOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { apiClient } from '../../api';

const { Title, Text, Paragraph } = Typography;

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiClient.get(`/courses/${id}`).then((res) => {
      setCourse(res.data.data);
    }).catch(() => {
      setCourse(null);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!course) return <Text type="danger">Khóa học không tồn tại.</Text>;

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/courses')} style={{ marginBottom: 16 }}>
        Quay lại
      </Button>

      {/* Course Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Tag color="blue">{course.accessType === 'free' ? 'Miễn phí' : course.accessType}</Tag>
            <Tag color={course.status === 'published' ? 'green' : 'default'}>{course.status}</Tag>
            <Title level={3} style={{ marginTop: 8 }}>{course.title}</Title>
            <Paragraph type="secondary">{course.description || 'Chưa có mô tả.'}</Paragraph>
            <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
              Bắt đầu học
            </Button>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'center', paddingTop: 20 }}>
            <BookOutlined style={{ fontSize: 64, color: '#1677ff' }} />
          </Col>
        </Row>
      </Card>

      {/* Course Info */}
      <Card title="Thông tin khóa học">
        <List>
          <List.Item><Text strong>Trạng thái:</Text> {course.status}</List.Item>
          <List.Item><Text strong>Loại truy cập:</Text> {course.accessType}</List.Item>
          {course.pointCost > 0 && <List.Item><Text strong>Điểm mở khóa:</Text> {course.pointCost}</List.Item>}
          <List.Item><Text strong>Ngày tạo:</Text> {new Date(course.createdAt).toLocaleDateString('vi-VN')}</List.Item>
        </List>
        <Paragraph type="secondary" style={{ marginTop: 16 }}>
          Nội dung bài học chi tiết sẽ hiển thị khi có dữ liệu từ hệ thống import tài liệu.
        </Paragraph>
      </Card>
    </div>
  );
}

export default CourseDetailPage;
