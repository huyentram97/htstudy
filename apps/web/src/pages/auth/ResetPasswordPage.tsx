import { useState } from 'react';
import { Card, Form, Input, Button, Typography, Result } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';

const { Title, Text } = Typography;

function ResetPasswordPage() {
  const [done, setDone] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const onFinish = async (values: { password: string }) => {
    // TODO: Call API reset password with token
    console.log('Reset password:', { token, password: values.password });
    setDone(true);
  };

  if (!token) {
    return (
      <Card style={{ width: 420, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Result
          status="error"
          title="Link không hợp lệ"
          subTitle="Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."
          extra={
            <Button type="primary">
              <Link to="/forgot-password">Gửi lại link mới</Link>
            </Button>
          }
        />
      </Card>
    );
  }

  if (done) {
    return (
      <Card style={{ width: 420, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Result
          status="success"
          title="Đặt lại mật khẩu thành công!"
          subTitle="Bạn có thể đăng nhập bằng mật khẩu mới."
          extra={
            <Button type="primary">
              <Link to="/login">Đăng nhập</Link>
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Card style={{ width: 420, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img src="/logo.png" alt="H-T.Study" style={{ height: 56, marginBottom: 8 }} />
        <Title level={3} style={{ margin: 0 }}>Đặt lại mật khẩu</Title>
        <Text type="secondary">Nhập mật khẩu mới cho tài khoản</Text>
      </div>

      <Form name="reset-password" onFinish={onFinish} size="large" layout="vertical">
        <Form.Item
          name="password"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Tối thiểu 8 ký tự" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve();
                return Promise.reject(new Error('Mật khẩu không khớp'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default ResetPasswordPage;
