import { Card, Table, Avatar, Tag, Tabs, Typography, Row, Col, Statistic } from 'antd';
import { TrophyOutlined, FireOutlined, StarOutlined, CrownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function LeaderboardPage() {
  const myStats = { rank: 12, points: 1250, streak: 7, level: 4 };

  const leaderboardData = [
    { rank: 1, name: 'Nguyễn Văn A', points: 5200, streak: 30, level: 8, avatar: null },
    { rank: 2, name: 'Trần Thị B', points: 4800, streak: 25, level: 7, avatar: null },
    { rank: 3, name: 'Lê Văn C', points: 4500, streak: 20, level: 7, avatar: null },
    { rank: 4, name: 'Phạm Thị D', points: 3900, streak: 15, level: 6, avatar: null },
    { rank: 5, name: 'Hoàng Văn E', points: 3600, streak: 12, level: 6, avatar: null },
    { rank: 6, name: 'Vũ Thị F', points: 3200, streak: 10, level: 5, avatar: null },
    { rank: 7, name: 'Đặng Văn G', points: 2800, streak: 8, level: 5, avatar: null },
    { rank: 8, name: 'Bùi Thị H', points: 2500, streak: 7, level: 5, avatar: null },
    { rank: 9, name: 'Ngô Văn I', points: 2200, streak: 5, level: 4, avatar: null },
    { rank: 10, name: 'Đỗ Thị K', points: 1900, streak: 3, level: 4, avatar: null },
  ];

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      width: 60,
      render: (rank: number) => {
        if (rank === 1) return <CrownOutlined style={{ color: '#faad14', fontSize: 20 }} />;
        if (rank === 2) return <CrownOutlined style={{ color: '#a0a0a0', fontSize: 18 }} />;
        if (rank === 3) return <CrownOutlined style={{ color: '#cd7f32', fontSize: 16 }} />;
        return <Text strong>{rank}</Text>;
      },
    },
    {
      title: 'Học viên',
      dataIndex: 'name',
      render: (name: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size="small">{name.charAt(0)}</Avatar>
          <Text>{name}</Text>
        </div>
      ),
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      render: (points: number) => <Text strong style={{ color: '#faad14' }}><StarOutlined /> {points.toLocaleString()}</Text>,
    },
    {
      title: 'Streak',
      dataIndex: 'streak',
      render: (streak: number) => <Tag color="red"><FireOutlined /> {streak} ngày</Tag>,
    },
    {
      title: 'Level',
      dataIndex: 'level',
      render: (level: number) => <Tag color="purple">Lv.{level}</Tag>,
    },
  ];

  const tabItems = [
    { key: 'weekly', label: 'Tuần này' },
    { key: 'monthly', label: 'Tháng này' },
    { key: 'alltime', label: 'Tổng' },
  ];

  return (
    <div>
      <Title level={3}><TrophyOutlined /> Bảng xếp hạng</Title>

      {/* My stats */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Row gutter={16}>
          <Col xs={6}><Statistic title={<Text style={{ color: '#fff' }}>Hạng</Text>} value={myStats.rank} valueStyle={{ color: '#fff' }} /></Col>
          <Col xs={6}><Statistic title={<Text style={{ color: '#fff' }}>Điểm</Text>} value={myStats.points} valueStyle={{ color: '#fff' }} prefix={<StarOutlined />} /></Col>
          <Col xs={6}><Statistic title={<Text style={{ color: '#fff' }}>Streak</Text>} value={myStats.streak} suffix="ngày" valueStyle={{ color: '#fff' }} prefix={<FireOutlined />} /></Col>
          <Col xs={6}><Statistic title={<Text style={{ color: '#fff' }}>Level</Text>} value={myStats.level} valueStyle={{ color: '#fff' }} /></Col>
        </Row>
      </Card>

      {/* Leaderboard table */}
      <Card>
        <Tabs items={tabItems} defaultActiveKey="weekly" />
        <Table
          dataSource={leaderboardData}
          columns={columns}
          rowKey="rank"
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
}

export default LeaderboardPage;
