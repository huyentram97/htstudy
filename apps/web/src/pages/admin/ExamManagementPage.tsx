import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Modal, Form, Input, InputNumber, Select, Tabs, Badge, Popconfirm, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
import { apiClient } from '../../api';

const { Title, Text } = Typography;

function ExamManagementPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [form] = Form.useForm();

  const fetchExams = () => {
    setLoading(true);
    apiClient.get('/exams').then((res) => {
      setExams(res.data.data || []);
    }).catch(() => setExams([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchExams(); }, []);

  const handleCreate = async (values: any) => {
    try {
      await apiClient.post('/exams', { ...values, questionCount: values.questionCount || 0 });
      message.success('Đã tạo đề thi (trạng thái: Nháp)');
      setIsModalOpen(false);
      form.resetFields();
      fetchExams();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi tạo');
    }
  };

  // Workflow actions
  const handleSubmitReview = async (id: string) => {
    try {
      // TODO: API submit exam for review
      message.success('Đã gửi duyệt');
      fetchExams();
    } catch (err: any) { message.error('Lỗi'); }
  };

  const handleApprove = async (id: string) => {
    try {
      // TODO: API approve exam
      message.success('Đã duyệt & xuất bản');
      fetchExams();
    } catch (err: any) { message.error('Lỗi'); }
  };

  const handleReject = async () => {
    try {
      // TODO: API reject exam
      message.success('Đã từ chối');
      setRejectModalOpen(false);
      setRejectReason('');
      fetchExams();
    } catch (err: any) { message.error('Lỗi'); }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: API delete exam
      message.success('Đã xóa');
      fetchExams();
    } catch (err: any) { message.error('Lỗi'); }
  };

  const statusConfig: Record<string, { color: string; text: string }> = {
    draft: { color: 'default', text: 'Nháp' },
    pending_review: { color: 'processing', text: 'Chờ duyệt' },
    published: { color: 'success', text: 'Đã xuất bản' },
    rejected: { color: 'error', text: 'Từ chối' },
  };

  const columns = [
    { title: 'Tên đề thi', dataIndex: 'title' },
    { title: 'Số câu', dataIndex: 'questionCount', width: 70 },
    { title: 'Thời gian', dataIndex: 'timeLimitMinutes', width: 90, render: (d: number) => d > 0 ? `${d} phút` : '-' },
    { title: 'Điểm đạt', dataIndex: 'passingScore', width: 80, render: (s: number) => s > 0 ? `${s}%` : '-' },
    { title: 'Trạng thái', dataIndex: 'status', render: (s: string) => <Tag color={statusConfig[s]?.color}>{statusConfig[s]?.text}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: (d: string) => d ? new Date(d).toLocaleDateString('vi-VN') : '-' },
    {
      title: 'Thao tác', width: 280,
      render: (_: any, record: any) => (
        <Space wrap>
          {/* Maker: Gửi duyệt khi draft hoặc rejected */}
          {(record.status === 'draft' || record.status === 'rejected') && (
            <Button size="small" icon={<SendOutlined />} onClick={() => handleSubmitReview(record.id)}>Gửi duyệt</Button>
          )}
          {/* Checker: Duyệt / Từ chối khi pending */}
          {record.status === 'pending_review' && (
            <>
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>Duyệt</Button>
              <Button size="small" danger icon={<CloseOutlined />} onClick={() => { setRejectingId(record.id); setRejectModalOpen(true); }}>Từ chối</Button>
            </>
          )}
          {/* Sửa chỉ khi draft hoặc rejected */}
          {(record.status === 'draft' || record.status === 'rejected') && (
            <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingExam(record); form.setFieldsValue(record); setIsModalOpen(true); }}>Sửa</Button>
          )}
          {/* Xóa */}
          <Popconfirm title="Xóa đề thi?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pendingCount = exams.filter((e) => e.status === 'pending_review').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Quản lý Luyện đề</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingExam(null); form.resetFields(); setIsModalOpen(true); }}>
          Tạo đề thi
        </Button>
      </div>

      <Card>
        <Tabs defaultActiveKey="all" items={[
          { key: 'all', label: `Tất cả (${exams.length})` },
          { key: 'pending', label: <Badge count={pendingCount} offset={[10, 0]}>Chờ duyệt</Badge> },
        ]} />
        <Table dataSource={exams} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} size="small" />
        {!loading && exams.length === 0 && <Text type="secondary">Chưa có đề thi nào.</Text>}
      </Card>

      {/* Workflow guide */}
      <Card style={{ marginTop: 16, background: '#f6ffed' }} size="small">
        <Text strong>Luồng Maker → Checker: </Text>
        <Tag color="default">Nháp</Tag> →
        <Tag color="processing">Chờ duyệt</Tag> →
        <Tag color="success">Đã xuất bản</Tag> | <Tag color="error">Từ chối</Tag>
        <br /><Text type="secondary">• Maker tạo & sửa khi Nháp/Từ chối → Gửi duyệt</Text>
        <br /><Text type="secondary">• Checker duyệt hoặc từ chối khi Chờ duyệt</Text>
        <br /><Text type="secondary">• Customer chỉ thấy đề đã xuất bản</Text>
      </Card>

      {/* Modal tạo/sửa */}
      <Modal title={editingExam ? 'Sửa đề thi' : 'Tạo đề thi (Nháp)'} open={isModalOpen} onCancel={() => { setIsModalOpen(false); setEditingExam(null); }} onOk={() => form.submit()} okText={editingExam ? 'Cập nhật' : 'Tạo'} width={500}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="title" label="Tên đề thi" rules={[{ required: true }]}>
            <Input placeholder="VD: Đề thi PTĐTCK - Đề 1" />
          </Form.Item>
          <Space>
            <Form.Item name="timeLimitMinutes" label="Thời gian (phút)" initialValue={60}>
              <InputNumber min={0} max={480} />
            </Form.Item>
            <Form.Item name="passingScore" label="Điểm đạt (%)" initialValue={60}>
              <InputNumber min={0} max={100} />
            </Form.Item>
            <Form.Item name="questionCount" label="Số câu" initialValue={40}>
              <InputNumber min={1} max={500} />
            </Form.Item>
          </Space>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal từ chối */}
      <Modal title="Từ chối đề thi" open={rejectModalOpen} onCancel={() => setRejectModalOpen(false)} onOk={handleReject} okText="Từ chối" okButtonProps={{ danger: true }}>
        <Input.TextArea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} placeholder="Lý do từ chối (tối thiểu 10 ký tự)..." />
      </Modal>
    </div>
  );
}

export default ExamManagementPage;
