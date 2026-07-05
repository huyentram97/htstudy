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
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text strong style={{ color: '#fff', fontSize: 18 }}>H-T.Study</Text>
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
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
          <Badge count={3}>
            <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Badge>
          <Dropdown menu={userMenu}>
            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
