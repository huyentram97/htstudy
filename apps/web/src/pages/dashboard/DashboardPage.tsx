import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Button, Typography, Spin, Empty } from 'antd';
import { FireOutlined, StarOutlined, TrophyOutlined, BookOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api';
import { useAuthStore } from '../../store/auth';

const { Title, Text } = Typography;

function DashboardPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [points, setPoints] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await apiClient.get('/courses');
        setCourses((coursesRes.data.data || []).slice(0, 5));
      } catch {}
      try {
        const pointsRes = await apiClient.get('/gamification/points');
        setPoints(pointsRes.data.data);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      <Title level={3}>Xin chào{user?.fullName ? `, ${user.fullName}` : ''}! 👋</Title>
      <Text type="secondary">Hôm nay bạn muốn học gì?</Text>

      {/* Stats - từ API gamification */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Streak" value={points?.currentStreakDays || 0} suffix="ngày" prefix={<FireOutlined style={{ color: '#ff4d4f' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Điểm" value={points?.totalPoints || 0} prefix={<StarOutlined style={{ color: '#faad14' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Level" value={points?.currentLevel || 1} prefix={<TrophyOutlined style={{ color: '#722ed1' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Khóa học" value={courses.length} prefix={<BookOutlined style={{ color: '#1677ff' }} />} /></Card>
        </Col>
      </Row>

      {/* Course list - từ API */}
      <Card title="Khóa học" extra={<a onClick={() => navigate('/courses')}>Xem tất cả</a>} style={{ marginTop: 24 }}>
        {courses.length > 0 ? (
          <List
            dataSource={courses}
            renderItem={(course) => (
              <List.Item actions={[
                <Button type="primary" icon={<RocketOutlined />} onClick={() => navigate(`/courses/${course.id}`)}>Vào học</Button>
              ]}>
                <List.Item.Meta
                  title={course.title}
                  description={course.description?.slice(0, 80)}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="Chưa có khóa học. Vui lòng đợi Admin tạo nội dung." />
        )}
      </Card>
    </div>
  );
}

export default DashboardPage;
