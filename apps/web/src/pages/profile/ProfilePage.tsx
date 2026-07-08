import { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Row, Col, Statistic, Tag, Spin } from 'antd';
import { UserOutlined, FireOutlined, StarOutlined, TrophyOutlined } from '@ant-design/icons';
import { apiClient } from '../../api';
import { useAuthStore } from '../../store/auth';

const { Title, Text } = Typography;

function ProfilePage() {
  const { user } = useAuthStore();
  const [points, setPoints] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/gamification/points').then((res) => {
      setPoints(res.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      {/* Profile Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24} align="middle">
          <Col><Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} /></Col>
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>{user?.fullName || 'User'}</Title>
            <Text type="secondary">{user?.email}</Text>
            <div style={{ marginTop: 8 }}>
              <Tag color="purple">Level {points?.currentLevel || 1}</Tag>
              <Tag color="red"><FireOutlined /> Streak: {points?.currentStreakDays || 0} ngày</Tag>
              {user?.roles?.map((r: string) => <Tag key={r} color={r === 'Admin' ? 'red' : 'blue'}>{r}</Tag>)}
            </div>
          </Col>
        </Row>
      </Card>

      {/* Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Tổng điểm" value={points?.totalPoints || 0} prefix={<StarOutlined style={{ color: '#faad14' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Điểm khả dụng" value={points?.availablePoints || 0} prefix={<StarOutlined style={{ color: '#52c41a' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Streak" value={points?.currentStreakDays || 0} suffix="ngày" prefix={<FireOutlined style={{ color: '#ff4d4f' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Level" value={points?.currentLevel || 1} prefix={<TrophyOutlined style={{ color: '#722ed1' }} />} /></Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProfilePage;
