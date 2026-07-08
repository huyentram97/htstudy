import { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Input, Select, Space, Modal, Form, Typography, Popconfirm, message, Spin } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import { apiClient } from '../../api';

const { Title } = Typography;

function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = () => {
    setLoading(true);
    apiClient.get('/users').then((res) => {
      setUsers(res.data.data || []);
    }).catch(() => setUsers([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (values: any) => {
    try {
      await apiClient.post('/users', values);
      message.success('Đã tạo người dùng');
      setIsModalOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi');
    }
  };

  const handleChangeStatus = async (id: string, status: string) => {
    try {
      await apiClient.patch(`/users/${id}/status`, { status });
      message.success(`Đã đổi trạng thái → ${status}`);
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/users/${id}`);
      message.success('Đã xóa');
      fetchUsers();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi');
    }
  };

  const columns = [
    { title: 'Username', dataIndex: 'username' },
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Trạng thái', dataIndex: 'status',
      render: (s: string) => <Tag color={s === 'active' ? 'green' : s === 'locked' ? 'red' : 'default'}>{s}</Tag>,
    },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: (d: string) => d ? new Date(d).toLocaleDateString('vi-VN') : '-' },
    {
      title: 'Thao tác', width: 200,
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'active' ? (
            <Button size="small" icon={<LockOutlined />} onClick={() => handleChangeStatus(record.id, 'locked')}>Khóa</Button>
          ) : (
            <Button size="small" onClick={() => handleChangeStatus(record.id, 'active')}>Mở khóa</Button>
          )}
          <Popconfirm title="Xóa người dùng?" onConfirm={() => handleDelete(record.id)}>
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Thêm người dùng</Button>
      </div>

      <Card>
        <Table dataSource={users} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal title="Thêm người dùng" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} okText="Tạo">
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagementPage;
