import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, List, Button, Tag, Typography, Spin } from 'antd';
import { FireOutlined, StarOutlined, TrophyOutlined, BookOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api';

const { Title, Text } = Typography;

function DashboardPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/courses').then((res) => {
      setCourses((res.data.data || []).slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Stats (will be from gamification API when available)
  const stats = { streak: 0, points: 0, level: 1, completedCourses: 0 };

  return (
    <div>
      <Title level={3}>Xin chào! 👋</Title>
      <Text type="secondary">Hôm nay bạn muốn học gì?</Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Streak" value={stats.streak} suffix="ngày" prefix={<FireOutlined style={{ color: '#ff4d4f' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Điểm" value={stats.points} prefix={<StarOutlined style={{ color: '#faad14' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Level" value={stats.level} suffix="/ 10" prefix={<TrophyOutlined style={{ color: '#722ed1' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Khóa học" value={courses.length} prefix={<BookOutlined style={{ color: '#1677ff' }} />} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Khóa học" extra={<a onClick={() => navigate('/courses')}>Xem tất cả</a>}>
            {loading ? <Spin /> : (
              <List
                dataSource={courses}
                renderItem={(course) => (
                  <List.Item actions={[<Button type="primary" icon={<RocketOutlined />} onClick={() => navigate(`/courses/${course.id}`)}>Vào học</Button>]}>
                    <List.Item.Meta title={course.title} description={course.description?.slice(0, 60)} />
                  </List.Item>
                )}
              />
            )}
            {!loading && courses.length === 0 && <Text type="secondary">Chưa có khóa học.</Text>}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
