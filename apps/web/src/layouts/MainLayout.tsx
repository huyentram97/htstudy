import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Badge, Dropdown, Typography } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  FileTextOutlined,
  TrophyOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  RobotOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/courses', icon: <BookOutlined />, label: 'Khóa học' },
    { key: '/exams', icon: <FileTextOutlined />, label: 'Luyện đề' },
    { key: '/learning-paths', icon: <TrophyOutlined />, label: 'Lộ trình' },
    { key: '/ai-chat', icon: <RobotOutlined />, label: 'AI Chat' },
    { key: '/leaderboard', icon: <TrophyOutlined />, label: 'Bảng xếp hạng' },
  ];

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'Hồ sơ' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') navigate('/login');
      if (key === 'profile') navigate('/profile');
    },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <img src="/logo.png" alt="H-T.Study" style={{ height: 32 }} />
          <Text strong style={{ color: '#fff', fontSize: 16 }}>H-T.Study</Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <Badge count={3}>
            <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Badge>
          <Dropdown menu={userMenu}>
            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer', backgroundColor: '#1677ff' }} />
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
