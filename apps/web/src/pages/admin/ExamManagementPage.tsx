import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Modal, Form, Input, InputNumber, Select, Tabs, Badge, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ExamManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [form] = Form.useForm();

  const exams = [
    { key: '1', title: 'Đề thi PTĐTCK - Đề 1', subject: 'Phân tích đầu tư CK', questions: 40, duration: 60, passingScore: 60, status: 'published', createdBy: 'maker01', createdAt: '01/07/2026' },
    { key: '2', title: 'Đề thi PTĐTCK - Đề 2', subject: 'Phân tích đầu tư CK', questions: 38, duration: 60, passingScore: 60, status: 'pending_review', createdBy: 'maker01', createdAt: '03/07/2026' },
    { key: '3', title: 'Đề thi Cơ bản TTCK - Đề 1', subject: 'Cơ bản TTCK', questions: 50, duration: 75, passingScore: 65, status: 'published', createdBy: 'admin', createdAt: '05/07/2026' },
    { key: '4', title: '800 câu trắc nghiệm TTCK', subject: 'Cơ bản TTCK', questions: 800, duration: 0, passingScore: 0, status: 'draft', createdBy: 'maker01', createdAt: '06/07/2026' },
    { key: '5', title: 'Đề thi PTĐTCK - Đề 3', subject: 'Phân tích đầu tư CK', questions: 35, duration: 45, passingScore: 60, status: 'rejected', createdBy: 'maker01', createdAt: '04/07/2026' },
  ];

  const statusConfig: Record<string, { color: string; text: string }> = {
    draft: { color: 'default', text: 'Nháp' },
    pending_review: { color: 'processing', text: 'Chờ duyệt' },
    published: { color: 'success', text: 'Đã xuất bản' },
    rejected: { color: 'error', text: 'Từ chối' },
  };

  const columns = [
    { title: 'Tên đề thi', dataIndex: 'title' },
    { title: 'Môn học', dataIndex: 'subject', render: (s: string) => <Tag>{s}</Tag> },
    { title: 'Số câu', dataIndex: 'questions', width: 70 },
    { title: 'Thời gian', dataIndex: 'duration', width: 90, render: (d: number) => d > 0 ? `${d} phút` : 'Không giới hạn' },
    { title: 'Điểm đạt', dataIndex: 'passingScore', width: 80, render: (s: number) => s > 0 ? `${s}%` : '-' },
    { title: 'Trạng thái', dataIndex: 'status', render: (s: string) => <Tag color={statusConfig[s]?.color}>{statusConfig[s]?.text}</Tag> },
    { title: 'Người tạo', dataIndex: 'createdBy', width: 90 },
    { title: 'Ngày tạo', dataIndex: 'createdAt', width: 100 },
    {
      title: 'Thao tác', width: 200,
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>Xem</Button>
          {record.status === 'pending_review' && (
            <>
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => message.success('Đã duyệt')}>Duyệt</Button>
              <Button size="small" danger icon={<CloseOutlined />} onClick={() => message.warning('Đã từ chối')}>Từ chối</Button>
            </>
          )}
          {(record.status === 'draft' || record.status === 'rejected') && (
            <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingExam(record); setIsModalOpen(true); }}>Sửa</Button>
          )}
          <Popconfirm title="Xóa đề thi này?" onConfirm={() => message.success('Đã xóa')}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pendingCount = exams.filter((e) => e.status === 'pending_review').length;

  const handleSave = (values: any) => {
    if (editingExam) {
      message.success('Đã cập nhật đề thi');
    } else {
      message.success('Đã tạo đề thi mới (trạng thái: Nháp)');
    }
    setIsModalOpen(false);
    setEditingExam(null);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Quản lý Luyện đề</Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingExam(null); setIsModalOpen(true); }}>
            Tạo đề thi
          </Button>
        </Space>
      </div>

      <Card>
        <Tabs defaultActiveKey="all" items={[
          { key: 'all', label: `Tất cả (${exams.length})` },
          { key: 'pending', label: <Badge count={pendingCount} offset={[10, 0]}>Chờ duyệt</Badge> },
          { key: 'published', label: 'Đã xuất bản' },
          { key: 'draft', label: 'Nháp' },
        ]} />
        <Table dataSource={exams} columns={columns} pagination={{ pageSize: 10 }} size="small" />
      </Card>

      {/* Workflow note */}
      <Card style={{ marginTop: 16, background: '#f6ffed' }}>
        <Title level={5}>Luồng Maker → Checker</Title>
        <Text>
          1. <Tag>Maker</Tag> tạo đề thi → trạng thái <Tag color="default">Nháp</Tag><br />
          2. Maker nhấn "Gửi duyệt" → trạng thái <Tag color="processing">Chờ duyệt</Tag><br />
          3. <Tag color="green">Checker</Tag> duyệt → <Tag color="success">Đã xuất bản</Tag> (hiển thị cho Customer)<br />
          4. Checker từ chối → <Tag color="error">Từ chối</Tag> (Maker sửa lại)
        </Text>
      </Card>

      {/* Modal tạo/sửa đề thi */}
      <Modal
        title={editingExam ? 'Sửa đề thi' : 'Tạo đề thi mới'}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); setEditingExam(null); }}
        onOk={() => form.submit()}
        okText={editingExam ? 'Cập nhật' : 'Tạo'}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} initialValues={editingExam || { duration: 60, passingScore: 60 }}>
          <Form.Item name="title" label="Tên đề thi" rules={[{ required: true }]}>
            <Input placeholder="VD: Đề thi PTĐTCK - Đề 4" />
          </Form.Item>
          <Form.Item name="subject" label="Môn học" rules={[{ required: true }]}>
            <Select placeholder="Chọn môn">
              <Select.Option value="ptdtck">Phân tích đầu tư chứng khoán</Select.Option>
              <Select.Option value="coban">Những vấn đề cơ bản của TTCK</Select.Option>
            </Select>
          </Form.Item>
          <Space>
            <Form.Item name="duration" label="Thời gian (phút)">
              <InputNumber min={0} max={480} />
            </Form.Item>
            <Form.Item name="passingScore" label="Điểm đạt (%)">
              <InputNumber min={0} max={100} />
            </Form.Item>
            <Form.Item name="questionCount" label="Số câu hỏi">
              <InputNumber min={5} max={500} />
            </Form.Item>
          </Space>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả đề thi..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ExamManagementPage;
