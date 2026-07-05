import { Row, Col, Card, Statistic, Typography, Table, Tag, Progress } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
  RiseOutlined,
  TeamOutlined,
  StarOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

function AdminDashboardPage() {
  const kpis = [
    { title: 'Tổng người dùng', value: 156, icon: <UserOutlined />, color: '#1677ff' },
    { title: 'Hoạt động hôm nay', value: 42, icon: <TeamOutlined />, color: '#52c41a' },
    { title: 'Khóa học', value: 12, icon: <BookOutlined />, color: '#722ed1' },
    { title: 'Bộ đề thi', value: 28, icon: <FileTextOutlined />, color: '#fa8c16' },
    { title: 'Tỷ lệ hoàn thành', value: 68, suffix: '%', icon: <RiseOutlined />, color: '#eb2f96' },
    { title: 'Điểm phát hành', value: 45200, icon: <StarOutlined />, color: '#faad14' },
  ];

  const recentUsers = [
    { key: '1', name: 'Nguyễn Văn A', email: 'a@gmail.com', role: 'Customer', status: 'active', joined: '05/07/2026' },
    { key: '2', name: 'Trần Thị B', email: 'b@gmail.com', role: 'Maker', status: 'active', joined: '04/07/2026' },
    { key: '3', name: 'Lê Văn C', email: 'c@gmail.com', role: 'Customer', status: 'inactive', joined: '03/07/2026' },
    { key: '4', name: 'Phạm Thị D', email: 'd@gmail.com', role: 'Checker', status: 'active', joined: '02/07/2026' },
  ];

  const columns = [
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Vai trò', dataIndex: 'role', render: (role: string) => <Tag color={role === 'Admin' ? 'red' : role === 'Maker' ? 'blue' : role === 'Checker' ? 'green' : 'default'}>{role}</Tag> },
    { title: 'Trạng thái', dataIndex: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s === 'active' ? 'Hoạt động' : 'Không hoạt động'}</Tag> },
    { title: 'Ngày tham gia', dataIndex: 'joined' },
  ];

  return (
    <div>
      <Title level={3}>Admin Dashboard</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {kpis.map((kpi, idx) => (
          <Col xs={12} sm={8} md={4} key={idx}>
            <Card>
              <Statistic title={kpi.title} value={kpi.value} suffix={kpi.suffix} prefix={<span style={{ color: kpi.color }}>{kpi.icon}</span>} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Người dùng mới đăng ký">
            <Table dataSource={recentUsers} columns={columns} pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top khóa học phổ biến">
            {[
              { name: 'Kế toán tài chính', percent: 92 },
              { name: 'Kiểm toán nội bộ', percent: 78 },
              { name: 'Thuế TNDN', percent: 65 },
              { name: 'IFRS Foundation', percent: 45 },
            ].map((course, idx) => (
              <div key={idx} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{course.name}</span>
                  <span>{course.percent}%</span>
                </div>
                <Progress percent={course.percent} showInfo={false} size="small" />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminDashboardPage;
