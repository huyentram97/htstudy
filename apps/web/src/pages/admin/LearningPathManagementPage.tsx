import { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Modal, Form, Input, Select, InputNumber, List, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function LearningPathManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<any>(null);
  const [form] = Form.useForm();

  const learningPaths = [
    {
      key: '1', title: 'Lộ trình thi Chứng chỉ hành nghề CK (Cơ bản + Phân tích)',
      description: 'Hoàn thành 2 môn: Cơ bản TTCK và Phân tích ĐTCK để đủ điều kiện thi chứng chỉ hành nghề.',
      certifications: ['Chứng chỉ hành nghề CK'],
      totalSteps: 5, enrolledUsers: 12, status: 'active',
      steps: [
        { order: 1, type: 'course', title: 'Cơ bản TTCK - Bài giảng', entityId: '304' },
        { order: 2, type: 'course', title: 'Cơ bản TTCK - Ôn tập', entityId: '305' },
        { order: 3, type: 'exam', title: 'Thi thử Cơ bản TTCK', entityId: 'exam1' },
        { order: 4, type: 'course', title: 'Phân tích ĐTCK - Lý thuyết + Công thức', entityId: '301' },
        { order: 5, type: 'exam', title: 'Thi thử Phân tích ĐTCK', entityId: 'exam2' },
      ],
    },
    {
      key: '2', title: 'Lộ trình nhanh - Phân tích đầu tư CK',
      description: 'Học nhanh lý thuyết, công thức và luyện đề môn Phân tích ĐTCK.',
      certifications: [],
      totalSteps: 4, enrolledUsers: 5, status: 'active',
      steps: [
        { order: 1, type: 'course', title: 'PT ĐTCK - Lý thuyết', entityId: '301' },
        { order: 2, type: 'course', title: 'PT ĐTCK - Công thức', entityId: '302' },
        { order: 3, type: 'course', title: 'PT ĐTCK - Bài tập mẫu', entityId: '303' },
        { order: 4, type: 'exam', title: 'Thi thử PT ĐTCK', entityId: 'exam1' },
      ],
    },
  ];

  const columns = [
    { title: 'Lộ trình', dataIndex: 'title', render: (title: string, record: any) => (
      <div>
        <Text strong>{title}</Text><br />
        <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
      </div>
    )},
    { title: 'Chứng chỉ', dataIndex: 'certifications', render: (certs: string[]) => certs.map((c) => <Tag key={c} color="gold" icon={<TrophyOutlined />}>{c}</Tag>) },
    { title: 'Số bước', dataIndex: 'totalSteps', width: 70 },
    { title: 'Đã đăng ký', dataIndex: 'enrolledUsers', width: 90 },
    { title: 'Trạng thái', dataIndex: 'status', width: 100, render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s === 'active' ? 'Hoạt động' : 'Ngưng'}</Tag> },
    { title: 'Thao tác', width: 150, render: (_: any, record: any) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingPath(record); setIsModalOpen(true); }}>Sửa</Button>
        <Popconfirm title="Xóa lộ trình này?" onConfirm={() => message.success('Đã xóa')}>
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    )},
  ];

  const handleSave = (values: any) => {
    message.success(editingPath ? 'Đã cập nhật lộ trình' : 'Đã tạo lộ trình mới');
    setIsModalOpen(false);
    setEditingPath(null);
    form.resetFields();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Quản lý Lộ trình học tập</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingPath(null); setIsModalOpen(true); }}>
          Tạo lộ trình
        </Button>
      </div>

      <Card>
        <Table dataSource={learningPaths} columns={columns} rowKey="key" pagination={false} />
      </Card>

      {/* Detail panel - show steps */}
      {learningPaths.map((path) => (
        <Card key={path.key} title={`Các bước: ${path.title}`} style={{ marginTop: 16 }} size="small">
          <List
            dataSource={path.steps}
            renderItem={(step, idx) => (
              <List.Item actions={[
                <Button size="small" icon={<ArrowUpOutlined />} disabled={idx === 0} />,
                <Button size="small" icon={<ArrowDownOutlined />} disabled={idx === path.steps.length - 1} />,
                <Button size="small" danger icon={<DeleteOutlined />} />,
              ]}>
                <List.Item.Meta
                  avatar={<Tag color={step.type === 'exam' ? 'red' : 'blue'}>{step.order}</Tag>}
                  title={step.title}
                  description={<Tag>{step.type === 'exam' ? 'Bài thi' : 'Khóa học'}</Tag>}
                />
              </List.Item>
            )}
          />
          <Button icon={<PlusOutlined />} block style={{ marginTop: 8 }}>Thêm bước</Button>
        </Card>
      ))}

      {/* Modal tạo/sửa lộ trình */}
      <Modal
        title={editingPath ? 'Sửa lộ trình' : 'Tạo lộ trình mới'}
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); setEditingPath(null); }}
        onOk={() => form.submit()}
        okText={editingPath ? 'Cập nhật' : 'Tạo'}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} initialValues={editingPath || {}}>
          <Form.Item name="title" label="Tên lộ trình" rules={[{ required: true }]}>
            <Input placeholder="VD: Lộ trình thi Chứng chỉ hành nghề CK" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="certifications" label="Chứng chỉ liên kết">
            <Select mode="tags" placeholder="Nhập tên chứng chỉ" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="active">
            <Select>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Ngưng</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default LearningPathManagementPage;
