import { Card, Avatar, Typography, Row, Col, Statistic, Tag, List, Progress, Divider } from 'antd';
import { UserOutlined, FireOutlined, StarOutlined, TrophyOutlined, BookOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ProfilePage() {
  const user = {
    name: 'Huyền Trâm',
    email: 'huyentram.101097@gmail.com',
    level: 4,
    levelName: 'Scholar',
    points: 1250,
    streak: 7,
    totalCourses: 5,
    completedCourses: 3,
    totalStudyHours: 48,
  };

  const badges = [
    { id: '1', name: 'Streak 7 ngày', icon: '🔥', earned: true },
    { id: '2', name: 'Hoàn thành khóa đầu', icon: '🎓', earned: true },
    { id: '3', name: 'Điểm 100%', icon: '💯', earned: true },
    { id: '4', name: 'Streak 30 ngày', icon: '⚡', earned: false },
    { id: '5', name: 'Top 10 Leaderboard', icon: '🏆', earned: false },
    { id: '6', name: 'Master Level', icon: '👑', earned: false },
  ];

  const certificates = [
    { id: '1', title: 'Kế toán Tài chính Cơ bản', date: '15/06/2026', code: 'HTS-2026-001' },
  ];

  return (
    <div>
      {/* Profile Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24} align="middle">
          <Col>
            <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
          </Col>
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>{user.name}</Title>
            <Text type="secondary">{user.email}</Text>
            <div style={{ marginTop: 8 }}>
              <Tag color="purple">Level {user.level} - {user.levelName}</Tag>
              <Tag color="red"><FireOutlined /> Streak: {user.streak} ngày</Tag>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Tổng điểm" value={user.points} prefix={<StarOutlined style={{ color: '#faad14' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Streak" value={user.streak} suffix="ngày" prefix={<FireOutlined style={{ color: '#ff4d4f' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Khóa học" value={user.completedCourses} suffix={`/ ${user.totalCourses}`} prefix={<BookOutlined style={{ color: '#1677ff' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Giờ học" value={user.totalStudyHours} suffix="h" prefix={<TrophyOutlined style={{ color: '#722ed1' }} />} /></Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Badges */}
        <Col xs={24} md={12}>
          <Card title="Huy hiệu">
            <Row gutter={[12, 12]}>
              {badges.map((badge) => (
                <Col span={8} key={badge.id} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, opacity: badge.earned ? 1 : 0.3 }}>{badge.icon}</div>
                  <Text style={{ fontSize: 12, color: badge.earned ? '#000' : '#ccc' }}>{badge.name}</Text>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Certificates */}
        <Col xs={24} md={12}>
          <Card title="Chứng chỉ">
            {certificates.length > 0 ? (
              <List
                dataSource={certificates}
                renderItem={(cert) => (
                  <List.Item actions={[<a key="download">Tải PDF</a>]}>
                    <List.Item.Meta
                      avatar={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />}
                      title={cert.title}
                      description={`Cấp ngày: ${cert.date} | Mã: ${cert.code}`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">Chưa có chứng chỉ nào</Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* Level Progress */}
      <Card title="Tiến độ Level" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Text>Level {user.level}</Text>
          <Progress percent={75} style={{ flex: 1 }} format={() => '1250 / 1500 điểm'} />
          <Text>Level {user.level + 1}</Text>
        </div>
      </Card>
    </div>
  );
}

export default ProfilePage;
