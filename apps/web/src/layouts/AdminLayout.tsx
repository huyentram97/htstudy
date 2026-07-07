import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Typography, Dropdown } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  AuditOutlined,
  LogoutOutlined,
  HomeOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/admin/users', icon: <UserOutlined />, label: 'Người dùng' },
    { key: '/admin/roles', icon: <SafetyOutlined />, label: 'Phân quyền' },
    { key: '/admin/content', icon: <BookOutlined />, label: 'Nội dung' },
    { key: '/admin/config', icon: <SettingOutlined />, label: 'Cấu hình' },
    { key: '/admin/audit', icon: <AuditOutlined />, label: 'Audit Log' },
    { type: 'divider' as const },
    { key: '/dashboard', icon: <HomeOutlined />, label: 'Về trang học' },
  ];

  const userMenu = {
    items: [
      { key: 'home', icon: <HomeOutlined />, label: 'Trang học viên' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === 'logout') navigate('/login');
      if (key === 'home') navigate('/dashboard');
    },
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" style={{ background: '#001529' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <img src="/logo.png" alt="H-T.Study" style={{ height: 28 }} />
          <Text strong style={{ color: '#fff', fontSize: 14 }}>Admin Panel</Text>
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
          <Text type="secondary">Admin</Text>
          <Dropdown menu={userMenu}>
            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer', backgroundColor: '#f5222d' }} />
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
