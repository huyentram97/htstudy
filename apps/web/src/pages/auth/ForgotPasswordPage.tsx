import { useState } from 'react';
import { Card, Form, Input, Button, Typography, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const onFinish = async (values: { email: string }) => {
    // TODO: Call API send reset email
    console.log('Reset password for:', values.email);
    setEmail(values.email);
    setSent(true);
  };

  if (sent) {
    return (
      <Card style={{ width: 420, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Result
          status="success"
          title="Email đã được gửi!"
          subTitle={
            <div>
              <Text>Chúng tôi đã gửi link đặt lại mật khẩu đến:</Text>
              <br />
              <Text strong>{email}</Text>
              <br /><br />
              <Text type="secondary">Vui lòng kiểm tra hộp thư (và thư mục spam). Link có hiệu lực trong 30 phút.</Text>
            </div>
          }
          extra={[
            <Button type="primary" key="login">
              <Link to="/login">Quay lại đăng nhập</Link>
            </Button>,
            <Button key="resend" onClick={() => setSent(false)}>
              Gửi lại
            </Button>,
          ]}
        />
      </Card>
    );
  }

  return (
    <Card style={{ width: 420, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img src="/logo.png" alt="H-T.Study" style={{ height: 56, marginBottom: 8 }} />
        <Title level={3} style={{ margin: 0 }}>Quên mật khẩu</Title>
        <Text type="secondary">Nhập email để nhận link đặt lại mật khẩu</Text>
      </div>

      <Form name="forgot-password" onFinish={onFinish} size="large" layout="vertical">
        <Form.Item
          name="email"
          label="Email đã đăng ký"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="email@example.com" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Gửi link đặt lại mật khẩu
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center' }}>
        <Link to="/login"><ArrowLeftOutlined /> Quay lại đăng nhập</Link>
      </div>
    </Card>
  );
}

export default ForgotPasswordPage;
