import { Row, Col, Card, Input, Select, Tag, Typography, Button, Progress } from 'antd';
import { SearchOutlined, LockOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Meta } = Card;

function CoursesPage() {
  // Mock data
  const courses = [
    { id: '1', title: 'Kế toán tài chính', subject: 'Kế toán', progress: 75, accessType: 'free', pointCost: 0 },
    { id: '2', title: 'Kiểm toán nội bộ', subject: 'Kiểm toán', progress: 45, accessType: 'free', pointCost: 0 },
    { id: '3', title: 'Thuế TNDN nâng cao', subject: 'Thuế', progress: 0, accessType: 'locked', pointCost: 200 },
    { id: '4', title: 'IFRS Foundation', subject: 'Kế toán', progress: 0, accessType: 'premium', pointCost: 0 },
    { id: '5', title: 'Quản trị rủi ro', subject: 'Quản trị', progress: 20, accessType: 'free', pointCost: 0 },
    { id: '6', title: 'Excel cho Kế toán', subject: 'Kỹ năng', progress: 0, accessType: 'locked', pointCost: 150 },
  ];

  return (
    <div>
      <Title level={3}>Khóa học</Title>

      {/* Filters */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Input placeholder="Tìm kiếm khóa học..." prefix={<SearchOutlined />} size="large" />
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Select placeholder="Môn học" style={{ width: '100%' }} size="large" allowClear>
            <Select.Option value="accounting">Kế toán</Select.Option>
            <Select.Option value="audit">Kiểm toán</Select.Option>
            <Select.Option value="tax">Thuế</Select.Option>
          </Select>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Select placeholder="Trạng thái" style={{ width: '100%' }} size="large" allowClear>
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="enrolled">Đang học</Select.Option>
            <Select.Option value="completed">Hoàn thành</Select.Option>
          </Select>
        </Col>
      </Row>

      {/* Course Grid */}
      <Row gutter={[16, 16]}>
        {courses.map((course) => (
          <Col xs={24} sm={12} md={8} key={course.id}>
            <Card
              hoverable
              cover={
                <div style={{ height: 140, background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 48 }}>📚</Text>
                </div>
              }
              actions={[
                course.accessType === 'locked' ? (
                  <Button type="default" icon={<LockOutlined />}>
                    <StarOutlined /> {course.pointCost} điểm
                  </Button>
                ) : course.progress > 0 ? (
                  <Button type="primary">Tiếp tục học</Button>
                ) : (
                  <Button type="primary">Bắt đầu</Button>
                ),
              ]}
            >
              <Meta
                title={
                  <span>
                    {course.title}
                    {course.accessType === 'premium' && <Tag color="gold" style={{ marginLeft: 8 }}>Premium</Tag>}
                    {course.accessType === 'locked' && <Tag color="red" style={{ marginLeft: 8 }}>Khóa</Tag>}
                  </span>
                }
                description={
                  <div>
                    <Tag>{course.subject}</Tag>
                    {course.progress > 0 && (
                      <Progress percent={course.progress} size="small" style={{ marginTop: 8 }} />
                    )}
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default CoursesPage;
