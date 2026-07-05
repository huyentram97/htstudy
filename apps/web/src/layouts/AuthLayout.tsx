import { Outlet } from 'react-router-dom';
import { Layout, Typography } from 'antd';

const { Content, Footer } = Layout;
const { Text, Link } = Typography;

function AuthLayout() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center', background: 'transparent' }}>
        <Text type="secondary">
          Cần hỗ trợ? Liên hệ: <Link href="mailto:support@htstudy.vn">support@htstudy.vn</Link>
        </Text>
        <br />
        <Text type="secondary">© 2026 H-T.Study. All rights reserved.</Text>
      </Footer>
    </Layout>
  );
}

export default AuthLayout;
