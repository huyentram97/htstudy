import { Card, Form, Input, Button, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

function RegisterPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    // TODO: Call API register
    console.log('Register:', values);
    message.success('Đăng ký thành công! Vui lòng đăng nhập.');
    navigate('/login');
  };

  return (
    <Card style={{ width: 420, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img src="/logo.png" alt="H-T.Study" style={{ height: 56, marginBottom: 8 }} />
        <Title level={3} style={{ margin: 0 }}>Tạo tài khoản</Title>
        <Text type="secondary">Đăng ký miễn phí để bắt đầu học</Text>
      </div>

      <Form form={form} name="register" onFinish={onFinish} size="large" layout="vertical">
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input prefix={<IdcardOutlined />} placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="email@example.com" />
        </Form.Item>

        <Form.Item
          name="username"
          label="Username đăng nhập"
          rules={[
            { required: true, message: 'Vui lòng nhập username' },
            { min: 3, message: 'Username tối thiểu 3 ký tự' },
            { max: 50, message: 'Username tối đa 50 ký tự' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: 'Chỉ chứa chữ, số và dấu _' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Tối thiểu 8 ký tự" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
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
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center' }}>
        <Text>Đã có tài khoản? </Text>
        <Link to="/login">Đăng nhập</Link>
      </div>
    </Card>
  );
}

export default RegisterPage;
