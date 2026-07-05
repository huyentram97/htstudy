import { useParams } from 'react-router-dom';
import { Card, Typography, Progress, List, Tag, Button, Collapse, Row, Col, Statistic } from 'antd';
import {
  PlayCircleOutlined,
  CheckCircleOutlined,
  LockOutlined,
  ClockCircleOutlined,
  BookOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

function CourseDetailPage() {
  const { id } = useParams();

  // Mock data
  const course = {
    id,
    title: 'Kế toán tài chính',
    description: 'Khóa học cung cấp kiến thức toàn diện về kế toán tài chính, bao gồm nguyên lý kế toán, báo cáo tài chính, và các chuẩn mực kế toán Việt Nam.',
    subject: 'Kế toán',
    progress: 75,
    totalLessons: 24,
    completedLessons: 18,
    totalDuration: '12 giờ',
    chapters: [
      {
        key: '1',
        title: 'Chương 1: Nguyên lý kế toán',
        lessons: [
          { id: '1', title: 'Bài 1: Giới thiệu kế toán', status: 'completed', duration: '25 phút' },
          { id: '2', title: 'Bài 2: Phương trình kế toán', status: 'completed', duration: '30 phút' },
          { id: '3', title: 'Bài 3: Tài khoản kế toán', status: 'completed', duration: '35 phút' },
        ],
      },
      {
        key: '2',
        title: 'Chương 2: Báo cáo tài chính',
        lessons: [
          { id: '4', title: 'Bài 4: Bảng cân đối kế toán', status: 'completed', duration: '40 phút' },
          { id: '5', title: 'Bài 5: Báo cáo kết quả kinh doanh', status: 'current', duration: '35 phút' },
          { id: '6', title: 'Bài 6: Báo cáo lưu chuyển tiền tệ', status: 'locked', duration: '30 phút' },
        ],
      },
      {
        key: '3',
        title: 'Chương 3: Chuẩn mực kế toán VN',
        lessons: [
          { id: '7', title: 'Bài 7: VAS 01 - Chuẩn mực chung', status: 'locked', duration: '45 phút' },
          { id: '8', title: 'Bài 8: VAS 02 - Hàng tồn kho', status: 'locked', duration: '40 phút' },
        ],
      },
    ],
  };

  const getLessonIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'current': return <PlayCircleOutlined style={{ color: '#1677ff' }} />;
      case 'locked': return <LockOutlined style={{ color: '#d9d9d9' }} />;
      default: return null;
    }
  };

  return (
    <div>
      {/* Course Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24} align="middle">
          <Col xs={24} md={16}>
            <Tag color="blue">{course.subject}</Tag>
            <Title level={3} style={{ marginTop: 8 }}>{course.title}</Title>
            <Paragraph type="secondary">{course.description}</Paragraph>
            <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
              Tiếp tục học
            </Button>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <Progress type="circle" percent={course.progress} />
              <div style={{ marginTop: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="Bài học" value={course.completedLessons} suffix={`/ ${course.totalLessons}`} prefix={<BookOutlined />} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Thời lượng" value={course.totalDuration} prefix={<ClockCircleOutlined />} />
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Chapter List */}
      <Card title="Nội dung khóa học">
        <Collapse defaultActiveKey={['1', '2']} items={course.chapters.map((chapter) => ({
          key: chapter.key,
          label: <Text strong>{chapter.title}</Text>,
          children: (
            <List
              dataSource={chapter.lessons}
              renderItem={(lesson) => (
                <List.Item
                  actions={[
                    <Text type="secondary"><ClockCircleOutlined /> {lesson.duration}</Text>,
                    lesson.status === 'current' ? (
                      <Button type="primary" size="small">Học tiếp</Button>
                    ) : lesson.status === 'completed' ? (
                      <Button size="small">Xem lại</Button>
                    ) : (
                      <Button size="small" disabled icon={<LockOutlined />}>Khóa</Button>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    avatar={getLessonIcon(lesson.status)}
                    title={lesson.title}
                  />
                </List.Item>
              )}
            />
          ),
        }))} />
      </Card>
    </div>
  );
}

export default CourseDetailPage;
