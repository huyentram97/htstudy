import { useState } from 'react';
import { Card, Form, Input, Button, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { useAuthStore } from '../../store/auth';

const { Title, Text } = Typography;

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await authApi.login(values);
      if (result.success && result.data?.accessToken) {
        login(result.data.accessToken, result.data.user);
        message.success('Đăng nhập thành công!');
        // Admin → redirect to admin panel
        if (result.data.user.roles?.includes('Admin')) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.error?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
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
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>

        <Divider plain>hoặc</Divider>

        <Button block size="large" onClick={() => navigate('/dashboard')}>
          Xem Demo (không cần đăng nhập)
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
