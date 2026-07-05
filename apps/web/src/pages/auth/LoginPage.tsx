import { Card, Form, Input, Button, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

function LoginPage() {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    // TODO: Integrate with Auth API
    console.log('Login:', values);
    navigate('/dashboard');
  };

  return (
    <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img src="/logo.png" alt="H-T.Study" style={{ height: 64, marginBottom: 8 }} />
        <Title level={2} style={{ margin: 0 }}>H-T.Study</Title>
        <Text type="secondary">Nền tảng eLearning thông minh</Text>
      </div>

      <Form name="login" onFinish={onFinish} size="large">
        <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form.Item>

        <Divider plain>hoặc</Divider>

        <Button block size="large" onClick={() => navigate('/dashboard')}>
          Đăng nhập với SSO
        </Button>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <a onClick={() => navigate('/forgot-password')}>Quên mật khẩu?</a>
        <span style={{ margin: '0 8px' }}>|</span>
        <a onClick={() => navigate('/register')}>Đăng ký tài khoản</a>
      </div>
    </Card>
  );
}

export default LoginPage;
