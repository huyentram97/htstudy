import { Row, Col, Card, Statistic, Progress, List, Button, Tag, Typography } from 'antd';
import {
  FireOutlined,
  StarOutlined,
  TrophyOutlined,
  BookOutlined,
  RocketOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

function DashboardPage() {
  // Mock data - sẽ được thay bằng API call
  const stats = {
    streak: 7,
    points: 1250,
    level: 4,
    completedCourses: 3,
  };

  const recentCourses = [
    { id: '1', title: 'Kế toán tài chính', progress: 75, lastAccessed: '2 giờ trước' },
    { id: '2', title: 'Kiểm toán nội bộ', progress: 45, lastAccessed: '1 ngày trước' },
    { id: '3', title: 'Thuế TNDN', progress: 20, lastAccessed: '3 ngày trước' },
  ];

  const dailyMissions = [
    { id: '1', title: 'Hoàn thành 1 bài học', progress: 100, completed: true },
    { id: '2', title: 'Trả lời đúng 5 câu quiz', progress: 60, completed: false },
    { id: '3', title: 'Học liên tục 30 phút', progress: 80, completed: false },
  ];

  return (
    <div>
      <Title level={3}>Xin chào! 👋</Title>
      <Text type="secondary">Hôm nay bạn muốn học gì?</Text>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Streak" value={stats.streak} suffix="ngày" prefix={<FireOutlined style={{ color: '#ff4d4f' }} />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Điểm" value={stats.points} prefix={<StarOutlined style={{ color: '#faad14' }} />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Level" value={stats.level} suffix="/ 10" prefix={<TrophyOutlined style={{ color: '#722ed1' }} />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic title="Khóa học" value={stats.completedCourses} suffix="hoàn thành" prefix={<BookOutlined style={{ color: '#1677ff' }} />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* Recent Courses */}
        <Col xs={24} lg={14}>
          <Card title="Tiếp tục học" extra={<a href="/courses">Xem tất cả</a>}>
            <List
              dataSource={recentCourses}
              renderItem={(course) => (
                <List.Item
                  actions={[
                    <Button type="primary" icon={<RocketOutlined />}>
                      Tiếp tục học
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={course.title}
                    description={
                      <div>
                        <Progress percent={course.progress} size="small" />
                        <Text type="secondary" style={{ fontSize: 12 }}>{course.lastAccessed}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Daily Missions */}
        <Col xs={24} lg={10}>
          <Card title="Nhiệm vụ hôm nay" extra={<Tag color="blue">+50 điểm bonus</Tag>}>
            <List
              dataSource={dailyMissions}
              renderItem={(mission) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>{mission.title}</Text>
                      {mission.completed && <Tag color="green">✓</Tag>}
                    </div>
                    <Progress
                      percent={mission.progress}
                      size="small"
                      status={mission.completed ? 'success' : 'active'}
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
