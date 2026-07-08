import { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Select, Tag, Typography, Button, Progress, Spin } from 'antd';
import { SearchOutlined, LockOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api';

const { Title, Text } = Typography;
const { Meta } = Card;

function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/courses', { params: { status: 'published' } }).then((res) => {
      setCourses(res.data.data || []);
    }).catch(() => {
      setCourses([]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Title level={3}>Khóa học</Title>

      {/* Filters */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Input placeholder="Tìm kiếm khóa học..." prefix={<SearchOutlined />} size="large" />
        </Col>
      </Row>

      {/* Course Grid */}
      <Row gutter={[16, 16]}>
        {courses.map((course) => (
          <Col xs={24} sm={12} md={8} key={course.id}>
            <Card
              hoverable
              onClick={() => navigate(`/courses/${course.id}`)}
              cover={
                <div style={{ height: 120, background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 40 }}>📚</Text>
                </div>
              }
              actions={[
                course.accessType === 'locked' ? (
                  <Button type="default" icon={<LockOutlined />} key="lock">
                    <StarOutlined /> {course.pointCost} điểm
                  </Button>
                ) : (
                  <Button type="primary" key="start" onClick={() => navigate(`/courses/${course.id}`)}>Vào học</Button>
                ),
              ]}
            >
              <Meta
                title={
                  <span>
                    {course.title}
                    {course.accessType === 'premium' && <Tag color="gold" style={{ marginLeft: 8 }}>Premium</Tag>}
                    {course.accessType === 'locked' && <Tag color="red" style={{ marginLeft: 8 }}>Khóa</Tag>}
                  </span>
                }
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{course.description?.slice(0, 80)}...</Text>
                    <Tag style={{ marginTop: 8 }}>{course.status === 'published' ? '✅ Đã xuất bản' : course.status}</Tag>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {courses.length === 0 && <Text type="secondary">Chưa có khóa học nào.</Text>}
    </div>
  );
}

export default CoursesPage;
