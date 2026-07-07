import { Card, Steps, Typography, Tag, Button, Progress, Row, Col } from 'antd';
import { CheckCircleOutlined, LockOutlined, PlayCircleOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

function LearningPathPage() {
  const paths = [
    {
      id: '1',
      title: 'Lộ trình CPA Việt Nam',
      description: 'Lộ trình toàn diện để đạt chứng chỉ CPA Việt Nam, từ nền tảng đến nâng cao.',
      certifications: ['CPA Việt Nam'],
      totalSteps: 6,
      completedSteps: 3,
      enrolled: true,
      steps: [
        { title: 'Kế toán tài chính cơ bản', type: 'course', status: 'completed' },
        { title: 'Luật kế toán & chuẩn mực', type: 'course', status: 'completed' },
        { title: 'Kiểm toán cơ bản', type: 'course', status: 'completed' },
        { title: 'Thuế & pháp luật kinh tế', type: 'course', status: 'current' },
        { title: 'Phân tích tài chính nâng cao', type: 'course', status: 'locked' },
        { title: 'Thi thử CPA tổng hợp', type: 'exam', status: 'locked' },
      ],
    },
    {
      id: '2',
      title: 'Lộ trình IFRS Foundation',
      description: 'Nắm vững các chuẩn mực báo cáo tài chính quốc tế.',
      certifications: ['IFRS Certificate'],
      totalSteps: 4,
      completedSteps: 0,
      enrolled: false,
      steps: [
        { title: 'IFRS Overview', type: 'course', status: 'locked' },
        { title: 'IFRS 9 - Financial Instruments', type: 'course', status: 'locked' },
        { title: 'IFRS 15 - Revenue', type: 'course', status: 'locked' },
        { title: 'IFRS Exam', type: 'exam', status: 'locked' },
      ],
    },
  ];

  const getStepIcon = (status: string) => {
    if (status === 'completed') return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    if (status === 'current') return <PlayCircleOutlined style={{ color: '#1677ff' }} />;
    return <LockOutlined style={{ color: '#d9d9d9' }} />;
  };

  return (
    <div>
      <Title level={3}>Lộ trình học tập</Title>
      <Paragraph type="secondary">Theo dõi tiến độ và hoàn thành lộ trình để nhận chứng chỉ</Paragraph>

      <Row gutter={[24, 24]}>
        {paths.map((path) => (
          <Col xs={24} key={path.id}>
            <Card>
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Title level={4}>{path.title}</Title>
                  <Paragraph type="secondary">{path.description}</Paragraph>
                  <div style={{ marginBottom: 12 }}>
                    {path.certifications.map((cert) => (
                      <Tag key={cert} color="gold" icon={<TrophyOutlined />}>{cert}</Tag>
                    ))}
                  </div>
                  {path.enrolled ? (
                    <div>
                      <Progress percent={Math.round((path.completedSteps / path.totalSteps) * 100)} />
                      <Text type="secondary">{path.completedSteps}/{path.totalSteps} bước hoàn thành</Text>
                    </div>
                  ) : (
                    <Button type="primary">Đăng ký lộ trình</Button>
                  )}
                </Col>
                <Col xs={24} md={16}>
                  <Steps
                    direction="vertical"
                    size="small"
                    current={path.steps.findIndex((s) => s.status === 'current')}
                    items={path.steps.map((step) => ({
                      title: step.title,
                      description: <Tag>{step.type === 'exam' ? 'Bài thi' : 'Khóa học'}</Tag>,
                      icon: getStepIcon(step.status),
                      status: step.status === 'completed' ? 'finish' : step.status === 'current' ? 'process' : 'wait',
                    }))}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default LearningPathPage;
