import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Tag, Spin, Empty } from 'antd';
import { UserOutlined, BookOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';
import { apiClient } from '../../api';

const { Title } = Typography;

function AdminDashboardPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await apiClient.get('/courses');
        setCourses(coursesRes.data.data || []);
      } catch {}
      try {
        const usersRes = await apiClient.get('/users');
        setUsers(usersRes.data.data || []);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  const userColumns = [
    { title: 'Tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Trạng thái', dataIndex: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: (d: string) => d ? new Date(d).toLocaleDateString('vi-VN') : '-' },
  ];

  return (
    <div>
      <Title level={3}>Admin Dashboard</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Người dùng" value={users.length} prefix={<UserOutlined style={{ color: '#1677ff' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Khóa học" value={courses.length} prefix={<BookOutlined style={{ color: '#722ed1' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Đã xuất bản" value={courses.filter((c) => c.status === 'published').length} prefix={<FileTextOutlined style={{ color: '#52c41a' }} />} /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card><Statistic title="Chờ duyệt" value={courses.filter((c) => c.status === 'pending_review').length} prefix={<TeamOutlined style={{ color: '#fa8c16' }} />} /></Card>
        </Col>
      </Row>

      <Card title="Người dùng gần đây">
        {users.length > 0 ? (
          <Table dataSource={users.slice(0, 5)} columns={userColumns} rowKey="id" pagination={false} size="small" />
        ) : (
          <Empty description="Chưa có người dùng nào ngoài admin." />
        )}
      </Card>
    </div>
  );
}

export default AdminDashboardPage;
