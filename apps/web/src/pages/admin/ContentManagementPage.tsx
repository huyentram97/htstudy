import { Card, Table, Tag, Button, Space, Typography, Tabs, Badge } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

function ContentManagementPage() {
  const courses = [
    { key: '1', title: 'Kế toán tài chính', subject: 'Kế toán', status: 'published', createdBy: 'maker01', reviewedBy: 'checker01', createdAt: '01/06/2026' },
    { key: '2', title: 'Kiểm toán nội bộ', subject: 'Kiểm toán', status: 'published', createdBy: 'maker01', reviewedBy: 'checker01', createdAt: '15/06/2026' },
    { key: '3', title: 'Thuế TNDN nâng cao', subject: 'Thuế', status: 'pending_review', createdBy: 'maker01', reviewedBy: null, createdAt: '01/07/2026' },
    { key: '4', title: 'IFRS Foundation', subject: 'Kế toán', status: 'draft', createdBy: 'maker01', reviewedBy: null, createdAt: '03/07/2026' },
    { key: '5', title: 'Quản trị rủi ro', subject: 'Quản trị', status: 'rejected', createdBy: 'maker01', reviewedBy: 'checker01', createdAt: '28/06/2026' },
  ];

  const statusConfig: Record<string, { color: string; text: string }> = {
    draft: { color: 'default', text: 'Nháp' },
    pending_review: { color: 'processing', text: 'Chờ duyệt' },
    published: { color: 'success', text: 'Đã xuất bản' },
    rejected: { color: 'error', text: 'Từ chối' },
  };

  const columns = [
    { title: 'Tên khóa học', dataIndex: 'title' },
    { title: 'Môn học', dataIndex: 'subject', render: (s: string) => <Tag>{s}</Tag> },
    {
      title: 'Trạng thái', dataIndex: 'status',
      render: (status: string) => <Tag color={statusConfig[status]?.color}>{statusConfig[status]?.text}</Tag>,
    },
    { title: 'Người tạo', dataIndex: 'createdBy' },
    { title: 'Người duyệt', dataIndex: 'reviewedBy', render: (v: string) => v || '-' },
    { title: 'Ngày tạo', dataIndex: 'createdAt' },
    {
      title: 'Thao tác',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>Xem</Button>
          {record.status === 'pending_review' && (
            <>
              <Button size="small" type="primary" icon={<CheckOutlined />}>Duyệt</Button>
              <Button size="small" danger icon={<CloseOutlined />}>Từ chối</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const pendingCount = courses.filter((c) => c.status === 'pending_review').length;

  const tabItems = [
    { key: 'all', label: `Tất cả (${courses.length})` },
    { key: 'pending', label: <Badge count={pendingCount} offset={[10, 0]}>Chờ duyệt</Badge> },
    { key: 'published', label: 'Đã xuất bản' },
    { key: 'draft', label: 'Nháp' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Quản lý nội dung</Title>
        <Button type="primary" icon={<PlusOutlined />}>Tạo khóa học</Button>
      </div>

      <Card>
        <Tabs items={tabItems} defaultActiveKey="all" />
        <Table dataSource={courses} columns={columns} pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}

export default ContentManagementPage;
