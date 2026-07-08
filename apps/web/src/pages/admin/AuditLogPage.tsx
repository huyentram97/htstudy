import { useState, useEffect } from 'react';
import { Card, Table, Tag, Typography, DatePicker, Select, Space, Button, Spin } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { apiClient } from '../../api';

const { Title } = Typography;
const { RangePicker } = DatePicker;

function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/audit-logs').then((res) => {
      setLogs(res.data.data || []);
    }).catch(() => setLogs([])).finally(() => setLoading(false));
  }, []);

  const actionColors: Record<string, string> = {
    create: 'green', update: 'blue', delete: 'red', access: 'default', login: 'cyan', logout: 'purple',
  };

  const columns = [
    { title: 'Thời gian', dataIndex: 'createdAt', render: (d: string) => d ? new Date(d).toLocaleString('vi-VN') : '-' },
    { title: 'User', dataIndex: 'userId', render: (u: string) => u?.slice(0, 8) || '-' },
    { title: 'Hành động', dataIndex: 'actionType', render: (a: string) => <Tag color={actionColors[a] || 'default'}>{a?.toUpperCase()}</Tag> },
    { title: 'Tài nguyên', dataIndex: 'resourceType' },
    { title: 'ID', dataIndex: 'resourceId', render: (id: string) => id?.slice(0, 8) || '-' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Audit Log</Title>
        <Button icon={<ExportOutlined />}>Export CSV</Button>
      </div>
      <Card>
        <Table dataSource={logs} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} size="small" />
        {logs.length === 0 && !loading && <p>Chưa có log nào.</p>}
      </Card>
    </div>
  );
}

export default AuditLogPage;
