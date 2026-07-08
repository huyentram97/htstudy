import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Tabs, Badge, Popconfirm, message, Modal, Form, Input, Select } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api';

const { Title, Text } = Typography;

function ContentManagementPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/courses');
      setCourses(res.data.data || []);
    } catch (err: any) {
      message.error('Không tải được danh sách khóa học');
    }
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleCreate = async (values: any) => {
    try {
      await apiClient.post('/courses', values);
      message.success('Đã tạo khóa học');
      setIsModalOpen(false);
      form.resetFields();
      fetchCourses();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi tạo khóa học');
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      await apiClient.put(`/courses/${editingCourse.id}`, values);
      message.success('Đã cập nhật');
      setIsModalOpen(false);
      setEditingCourse(null);
      form.resetFields();
      fetchCourses();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi cập nhật');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/courses/${id}`);
      message.success('Đã xóa');
      fetchCourses();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi xóa');
    }
  };

  const handleSubmitReview = async (id: string) => {
    try {
      await apiClient.post(`/courses/${id}/submit`);
      message.success('Đã gửi duyệt');
      fetchCourses();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await apiClient.post(`/courses/${id}/approve`);
      message.success('Đã duyệt & xuất bản');
      fetchCourses();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi duyệt');
    }
  };

  const handleReject = async () => {
    try {
      await apiClient.post(`/courses/${rejectingId}/reject`, { reason: rejectReason });
      message.success('Đã từ chối');
      setRejectModalOpen(false);
      setRejectReason('');
      fetchCourses();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi từ chối');
    }
  };

  const statusConfig: Record<string, { color: string; text: string }> = {
    draft: { color: 'default', text: 'Nháp' },
    pending_review: { color: 'processing', text: 'Chờ duyệt' },
    published: { color: 'success', text: 'Đã xuất bản' },
    rejected: { color: 'error', text: 'Từ chối' },
  };

  const columns = [
    { title: 'Tên khóa học', dataIndex: 'title' },
    { title: 'Trạng thái', dataIndex: 'status', render: (s: string) => <Tag color={statusConfig[s]?.color}>{statusConfig[s]?.text}</Tag> },
    { title: 'Truy cập', dataIndex: 'accessType', render: (s: string) => <Tag>{s}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString('vi-VN') },
    {
      title: 'Thao tác', width: 320,
      render: (_: any, record: any) => (
        <Space wrap>
          {record.status === 'draft' && (
            <Button size="small" icon={<SendOutlined />} onClick={() => handleSubmitReview(record.id)}>Gửi duyệt</Button>
          )}
          {record.status === 'pending_review' && (
            <>
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>Duyệt</Button>
              <Button size="small" danger icon={<CloseOutlined />} onClick={() => { setRejectingId(record.id); setRejectModalOpen(true); }}>Từ chối</Button>
            </>
          )}
          {record.status === 'rejected' && (
            <Button size="small" icon={<SendOutlined />} onClick={() => handleSubmitReview(record.id)}>Gửi lại</Button>
          )}
          <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/admin/courses/${record.id}`)}>Sửa</Button>
          <Popconfirm title="Xóa khóa học này?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pendingCount = courses.filter((c) => c.status === 'pending_review').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Quản lý Khóa học</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/courses/new')}>Tạo khóa học</Button>
      </div>

      <Card>
        <Tabs defaultActiveKey="all" items={[
          { key: 'all', label: `Tất cả (${courses.length})` },
          { key: 'pending', label: <Badge count={pendingCount} offset={[10, 0]}>Chờ duyệt</Badge> },
        ]} />
        <Table dataSource={courses} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} size="small" />
      </Card>

      {/* Workflow guide */}
      <Card style={{ marginTop: 16, background: '#f6ffed' }} size="small">
        <Text strong>Luồng Maker → Checker: </Text>
        <Tag color="default">Nháp</Tag> → <Tag color="processing">Chờ duyệt</Tag> → <Tag color="success">Đã xuất bản</Tag> | <Tag color="error">Từ chối</Tag>
      </Card>

      {/* Modal tạo/sửa */}
      <Modal title={editingCourse ? 'Sửa khóa học' : 'Tạo khóa học'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} okText={editingCourse ? 'Cập nhật' : 'Tạo'}>
        <Form form={form} layout="vertical" onFinish={editingCourse ? handleUpdate : handleCreate}>
          <Form.Item name="title" label="Tên khóa học" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="accessType" label="Loại truy cập" initialValue="free">
            <Select>
              <Select.Option value="free">Miễn phí</Select.Option>
              <Select.Option value="locked">Khóa (mở bằng điểm)</Select.Option>
              <Select.Option value="premium">Premium</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal từ chối */}
      <Modal title="Từ chối khóa học" open={rejectModalOpen} onCancel={() => setRejectModalOpen(false)} onOk={handleReject} okText="Từ chối" okButtonProps={{ danger: true }}>
        <Input.TextArea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} placeholder="Lý do từ chối (tối thiểu 10 ký tự)..." />
      </Modal>
    </div>
  );
}

export default ContentManagementPage;
