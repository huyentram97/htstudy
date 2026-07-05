import { useState } from 'react';
import { Card, Table, Button, Tag, Input, Select, Space, Modal, Form, Typography, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

const { Title } = Typography;

function UserManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const users = [
    { key: '1', username: 'admin', fullName: 'System Admin', email: 'admin@htstudy.uk', phone: '+84912345678', role: 'Admin', status: 'active', createdAt: '01/01/2026' },
    { key: '2', username: 'maker01', fullName: 'Nguyễn Văn Maker', email: 'maker@htstudy.uk', phone: '+84987654321', role: 'Maker', status: 'active', createdAt: '15/03/2026' },
    { key: '3', username: 'checker01', fullName: 'Trần Thị Checker', email: 'checker@htstudy.uk', phone: '+84911222333', role: 'Checker', status: 'active', createdAt: '20/03/2026' },
    { key: '4', username: 'user001', fullName: 'Lê Văn User', email: 'user1@gmail.com', phone: '+84900111222', role: 'Customer', status: 'active', createdAt: '01/05/2026' },
    { key: '5', username: 'user002', fullName: 'Phạm Thị Học', email: 'user2@gmail.com', phone: '+84900333444', role: 'Customer', status: 'inactive', createdAt: '15/05/2026' },
    { key: '6', username: 'user003', fullName: 'Hoàng Văn Siêng', email: 'user3@gmail.com', phone: '+84900555666', role: 'Customer', status: 'locked', createdAt: '20/06/2026' },
  ];

  const columns = [
    { title: 'Username', dataIndex: 'username', sorter: true },
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    {
      title: 'Vai trò', dataIndex: 'role',
      render: (role: string) => {
        const colors: Record<string, string> = { Admin: 'red', Maker: 'blue', Checker: 'green', Customer: 'default' };
        return <Tag color={colors[role]}>{role}</Tag>;
      },
      filters: [
        { text: 'Admin', value: 'Admin' },
        { text: 'Maker', value: 'Maker' },
        { text: 'Checker', value: 'Checker' },
        { text: 'Customer', value: 'Customer' },
      ],
    },
    {
      title: 'Trạng thái', dataIndex: 'status',
      render: (status: string) => {
        const config: Record<string, { color: string; text: string }> = {
          active: { color: 'green', text: 'Hoạt động' },
          inactive: { color: 'default', text: 'Ngưng' },
          locked: { color: 'red', text: 'Khóa' },
        };
        return <Tag color={config[status]?.color}>{config[status]?.text}</Tag>;
      },
    },
    { title: 'Ngày tạo', dataIndex: 'createdAt' },
    {
      title: 'Thao tác',
      render: () => (
        <Space>
          <Button size="small" icon={<EditOutlined />} />
          <Button size="small" icon={<LockOutlined />} />
          <Popconfirm title="Xóa người dùng này?">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Quản lý người dùng</Title>
        <Space>
          <Button>Import CSV</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Thêm người dùng
          </Button>
        </Space>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} style={{ width: 250 }} />
          <Select placeholder="Vai trò" style={{ width: 120 }} allowClear>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="Maker">Maker</Select.Option>
            <Select.Option value="Checker">Checker</Select.Option>
            <Select.Option value="Customer">Customer</Select.Option>
          </Select>
          <Select placeholder="Trạng thái" style={{ width: 130 }} allowClear>
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="inactive">Ngưng</Select.Option>
            <Select.Option value="locked">Khóa</Select.Option>
          </Select>
        </Space>
        <Table dataSource={users} columns={columns} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title="Thêm người dùng" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} okText="Tạo" cancelText="Hủy">
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Customer">Customer</Select.Option>
              <Select.Option value="Maker">Maker</Select.Option>
              <Select.Option value="Checker">Checker</Select.Option>
              <Select.Option value="Admin">Admin</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagementPage;
