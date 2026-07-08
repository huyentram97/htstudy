import { useState, useEffect } from 'react';
import { Card, Table, Typography, Tag, Spin } from 'antd';
import { TrophyOutlined, FireOutlined, StarOutlined, CrownOutlined } from '@ant-design/icons';
import { apiClient } from '../../api';

const { Title, Text } = Typography;

function LeaderboardPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/gamification/leaderboard').then((res) => {
      setEntries(res.data.data || []);
    }).catch(() => setEntries([])).finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: '#', dataIndex: 'rank', width: 50, render: (rank: number) => rank <= 3 ? <CrownOutlined style={{ color: rank === 1 ? '#faad14' : rank === 2 ? '#a0a0a0' : '#cd7f32', fontSize: 18 }} /> : rank },
    { title: 'User', dataIndex: 'userId', render: (id: string) => <Text>{id?.slice(0, 8)}...</Text> },
    { title: 'Điểm', dataIndex: 'totalPoints', render: (p: number) => <Text strong><StarOutlined style={{ color: '#faad14' }} /> {p || 0}</Text> },
    { title: 'Level', dataIndex: 'currentLevel', render: (l: number) => <Tag color="purple">Lv.{l || 1}</Tag> },
    { title: 'Streak', dataIndex: 'currentStreakDays', render: (s: number) => <Tag color="red"><FireOutlined /> {s || 0} ngày</Tag> },
  ];

  return (
    <div>
      <Title level={3}><TrophyOutlined /> Bảng xếp hạng</Title>
      <Card>
        {loading ? <Spin /> : (
          entries.length > 0 ? (
            <Table dataSource={entries} columns={columns} rowKey="userId" pagination={false} />
          ) : (
            <Text type="secondary">Chưa có dữ liệu xếp hạng. Hãy học và tích điểm!</Text>
          )
        )}
      </Card>
    </div>
  );
}

export default LeaderboardPage;
