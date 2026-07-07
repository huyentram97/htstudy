import { useState } from 'react';
import { Card, Table, Button, Tag, Typography, Tabs, Modal, Form, Input, Select, Checkbox, Row, Col, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function RolePermissionPage() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [roleForm] = Form.useForm();

  // Mock data - sẽ thay bằng API thật
  const roles = [
    { id: '1', name: 'Admin', description: 'Toàn quyền quản trị hệ thống', isSystem: true, userCount: 1, permissions: ['all'] },
    { id: '2', name: 'Maker', description: 'Tạo và chỉnh sửa nội dung học tập', isSystem: true, userCount: 2, permissions: ['course.create', 'course.update', 'lesson.create', 'lesson.update', 'question.create', 'media.upload'] },
    { id: '3', name: 'Checker', description: 'Duyệt và publish nội dung', isSystem: true, userCount: 1, permissions: ['course.approve', 'course.reject', 'question.approve', 'content.review'] },
    { id: '4', name: 'Customer', description: 'Học, luyện đề, mở khóa bằng điểm', isSystem: true, userCount: 50, permissions: ['course.read', 'lesson.read', 'exam.take', 'progress.write', 'gamification.earn'] },
  ];

  const allPermissions = [
    { group: 'Khóa học', permissions: [
      { key: 'course.create', label: 'Tạo khóa học' },
      { key: 'course.read', label: 'Xem khóa học' },
      { key: 'course.update', label: 'Sửa khóa học' },
      { key: 'course.delete', label: 'Xóa khóa học' },
      { key: 'course.approve', label: 'Duyệt khóa học' },
      { key: 'course.reject', label: 'Từ chối khóa học' },
    ]},
    { group: 'Bài học', permissions: [
      { key: 'lesson.create', label: 'Tạo bài học' },
      { key: 'lesson.read', label: 'Xem bài học' },
      { key: 'lesson.update', label: 'Sửa bài học' },
      { key: 'lesson.delete', label: 'Xóa bài học' },
    ]},
    { group: 'Câu hỏi & Đề thi', permissions: [
      { key: 'question.create', label: 'Tạo câu hỏi' },
      { key: 'question.approve', label: 'Duyệt câu hỏi' },
      { key: 'exam.create', label: 'Tạo đề thi' },
      { key: 'exam.take', label: 'Làm bài thi' },
    ]},
    { group: 'Người dùng', permissions: [
      { key: 'user.create', label: 'Tạo người dùng' },
      { key: 'user.read', label: 'Xem người dùng' },
      { key: 'user.update', label: 'Sửa người dùng' },
      { key: 'user.delete', label: 'Xóa người dùng' },
      { key: 'user.lock', label: 'Khóa tài khoản' },
    ]},
    { group: 'Hệ thống', permissions: [
      { key: 'config.read', label: 'Xem cấu hình' },
      { key: 'config.update', label: 'Sửa cấu hình' },
      { key: 'audit.read', label: 'Xem audit log' },
      { key: 'import.run', label: 'Import nội dung' },
      { key: 'report.read', label: 'Xem báo cáo' },
      { key: 'report.export', label: 'Export dữ liệu' },
    ]},
    { group: 'Gamification', permissions: [
      { key: 'gamification.earn', label: 'Nhận điểm' },
      { key: 'gamification.config', label: 'Cấu hình gamification' },
      { key: 'badge.create', label: 'Tạo huy hiệu' },
    ]},
    { group: 'Media & Nội dung', permissions: [
      { key: 'media.upload', label: 'Upload media' },
      { key: 'media.delete', label: 'Xóa media' },
      { key: 'content.review', label: 'Review nội dung' },
    ]},
    { group: 'Học tập', permissions: [
      { key: 'progress.write', label: 'Lưu tiến độ' },
      { key: 'bookmark.write', label: 'Tạo bookmark/note' },
      { key: 'ai.chat', label: 'Dùng AI Chat' },
    ]},
  ];

  const roleColumns = [
    { title: 'Vai trò', dataIndex: 'name', render: (name: string, record: any) => (
      <Space>
        <Text strong>{name}</Text>
        {record.isSystem && <Tag color="blue">Hệ thống</Tag>}
      </Space>
    )},
    { title: 'Mô tả', dataIndex: 'description' },
    { title: 'Số user', dataIndex: 'userCount', width: 80 },
    { title: 'Quyền', dataIndex: 'permissions', render: (perms: string[]) => (
      perms[0] === 'all' ? <Tag color="red">Toàn quyền</Tag> : <Text type="secondary">{perms.length} quyền</Text>
    )},
    { title: 'Thao tác', width: 150, render: (_: any, record: any) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => { setEditingRole(record); setIsPermModalOpen(true); }}>Phân quyền</Button>
        {!record.isSystem && (
          <Popconfirm title="Xóa vai trò này?">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        )}
      </Space>
    )},
  ];

  const handleCreateRole = (values: any) => {
    message.success(`Đã tạo vai trò: ${values.name}`);
    setIsRoleModalOpen(false);
    roleForm.resetFields();
  };

  const handleSavePermissions = () => {
    message.success(`Đã cập nhật quyền cho: ${editingRole?.name}`);
    setIsPermModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}><SafetyOutlined /> Phân quyền hệ thống</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsRoleModalOpen(true)}>
          Tạo vai trò mới
        </Button>
      </div>

      <Tabs defaultActiveKey="roles" items={[
        {
          key: 'roles',
          label: 'Vai trò & Quyền',
          children: (
            <Card>
              <Table dataSource={roles} columns={roleColumns} rowKey="id" pagination={false} />
            </Card>
          ),
        },
        {
          key: 'matrix',
          label: 'Ma trận phân quyền',
          children: (
            <Card>
              <Table
                dataSource={allPermissions.flatMap((g) => g.permissions.map((p) => ({ ...p, group: g.group })))}
                columns={[
                  { title: 'Nhóm', dataIndex: 'group', width: 150, render: (v: string, _: any, idx: number) => {
                    const prev = idx > 0 ? allPermissions.flatMap((g) => g.permissions.map((p) => ({ group: g.group })))[idx - 1]?.group : '';
                    return v !== prev ? <Text strong>{v}</Text> : '';
                  }},
                  { title: 'Quyền', dataIndex: 'label' },
                  { title: 'Admin', width: 70, render: () => <Checkbox checked disabled /> },
                  { title: 'Maker', width: 70, render: (_: any, record: any) => <Checkbox checked={['course.create','course.update','lesson.create','lesson.update','question.create','media.upload'].includes(record.key)} /> },
                  { title: 'Checker', width: 80, render: (_: any, record: any) => <Checkbox checked={['course.approve','course.reject','question.approve','content.review'].includes(record.key)} /> },
                  { title: 'Customer', width: 90, render: (_: any, record: any) => <Checkbox checked={['course.read','lesson.read','exam.take','progress.write','gamification.earn','bookmark.write','ai.chat'].includes(record.key)} /> },
                ]}
                rowKey="key"
                pagination={false}
                size="small"
              />
            </Card>
          ),
        },
      ]} />

      {/* Modal tạo vai trò mới */}
      <Modal title="Tạo vai trò mới" open={isRoleModalOpen} onCancel={() => setIsRoleModalOpen(false)} onOk={() => roleForm.submit()} okText="Tạo">
        <Form form={roleForm} layout="vertical" onFinish={handleCreateRole}>
          <Form.Item name="name" label="Tên vai trò" rules={[{ required: true }]}>
            <Input placeholder="VD: Content Manager" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea placeholder="Mô tả chức năng của vai trò" />
          </Form.Item>
          <Form.Item name="permissions" label="Quyền">
            {allPermissions.map((group) => (
              <div key={group.group} style={{ marginBottom: 12 }}>
                <Text strong>{group.group}</Text>
                <Row gutter={[8, 4]} style={{ marginTop: 4 }}>
                  {group.permissions.map((p) => (
                    <Col span={12} key={p.key}>
                      <Checkbox value={p.key}>{p.label}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal phân quyền cho vai trò */}
      <Modal title={`Phân quyền: ${editingRole?.name}`} open={isPermModalOpen} onCancel={() => setIsPermModalOpen(false)} onOk={handleSavePermissions} okText="Lưu" width={600}>
        {editingRole?.name === 'Admin' ? (
          <Text type="secondary">Admin có toàn quyền hệ thống, không thể chỉnh sửa.</Text>
        ) : (
          allPermissions.map((group) => (
            <div key={group.group} style={{ marginBottom: 16 }}>
              <Text strong>{group.group}</Text>
              <Row gutter={[8, 4]} style={{ marginTop: 4 }}>
                {group.permissions.map((p) => (
                  <Col span={12} key={p.key}>
                    <Checkbox defaultChecked={editingRole?.permissions?.includes(p.key)}>{p.label}</Checkbox>
                  </Col>
                ))}
              </Row>
            </div>
          ))
        )}
      </Modal>
    </div>
  );
}

export default RolePermissionPage;
