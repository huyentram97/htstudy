import { Card, Table, Tag, Typography, DatePicker, Select, Space, Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { RangePicker } = DatePicker;

function AuditLogPage() {
  const logs = [
    { key: '1', timestamp: '05/07/2026 15:30:22', user: 'admin', action: 'login', resource: 'auth', resourceId: '-', ip: '113.161.x.x' },
    { key: '2', timestamp: '05/07/2026 15:32:10', user: 'admin', action: 'create', resource: 'course', resourceId: 'c-001', ip: '113.161.x.x' },
    { key: '3', timestamp: '05/07/2026 14:20:05', user: 'maker01', action: 'update', resource: 'lesson', resourceId: 'l-042', ip: '42.115.x.x' },
    { key: '4', timestamp: '05/07/2026 13:15:30', user: 'checker01', action: 'update', resource: 'course', resourceId: 'c-003', ip: '14.232.x.x' },
    { key: '5', timestamp: '05/07/2026 12:00:00', user: 'user001', action: 'access', resource: 'lesson', resourceId: 'l-015', ip: '27.72.x.x' },
    { key: '6', timestamp: '05/07/2026 11:45:00', user: 'user002', action: 'login', resource: 'auth', resourceId: '-', ip: '118.70.x.x' },
    { key: '7', timestamp: '04/07/2026 22:10:00', user: 'admin', action: 'update', resource: 'config', resourceId: 'system', ip: '113.161.x.x' },
    { key: '8', timestamp: '04/07/2026 20:30:00', user: 'maker01', action: 'create', resource: 'question', resourceId: 'q-128', ip: '42.115.x.x' },
  ];

  const actionColors: Record<string, string> = {
    create: 'green',
    update: 'blue',
    delete: 'red',
    access: 'default',
    login: 'cyan',
    logout: 'purple',
  };

  const columns = [
    { title: 'Thời gian', dataIndex: 'timestamp', width: 180 },
    { title: 'User', dataIndex: 'user' },
    { title: 'Hành động', dataIndex: 'action', render: (a: string) => <Tag color={actionColors[a]}>{a.toUpperCase()}</Tag> },
    { title: 'Tài nguyên', dataIndex: 'resource' },
    { title: 'ID', dataIndex: 'resourceId' },
    { title: 'IP', dataIndex: 'ip' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Audit Log</Title>
        <Button icon={<ExportOutlined />}>Export CSV</Button>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <RangePicker />
          <Select placeholder="User" style={{ width: 150 }} allowClear>
            <Select.Option value="admin">admin</Select.Option>
            <Select.Option value="maker01">maker01</Select.Option>
            <Select.Option value="checker01">checker01</Select.Option>
          </Select>
          <Select placeholder="Hành động" style={{ width: 130 }} allowClear>
            <Select.Option value="create">Create</Select.Option>
            <Select.Option value="update">Update</Select.Option>
            <Select.Option value="delete">Delete</Select.Option>
            <Select.Option value="login">Login</Select.Option>
            <Select.Option value="access">Access</Select.Option>
          </Select>
          <Select placeholder="Tài nguyên" style={{ width: 130 }} allowClear>
            <Select.Option value="course">Course</Select.Option>
            <Select.Option value="lesson">Lesson</Select.Option>
            <Select.Option value="question">Question</Select.Option>
            <Select.Option value="auth">Auth</Select.Option>
            <Select.Option value="config">Config</Select.Option>
          </Select>
        </Space>

        <Table dataSource={logs} columns={columns} pagination={{ pageSize: 20, showTotal: (t) => `Tổng ${t} bản ghi` }} size="small" />
      </Card>
    </div>
  );
}

export default AuditLogPage;
