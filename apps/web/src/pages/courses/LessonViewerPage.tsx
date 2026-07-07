import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Button, Progress, Tabs, Space, Tag, Tooltip } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  BookOutlined,
  StarOutlined,
  MessageOutlined,
  HighlightOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

function LessonViewerPage() {
  const { courseId, lessonId } = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);

  const lesson = {
    title: 'Bài 5: Báo cáo kết quả kinh doanh',
    chapter: 'Chương 2: Báo cáo tài chính',
    course: 'Kế toán tài chính',
    contentType: 'slide',
    totalSlides: 5,
    slides: [
      { title: 'Giới thiệu', content: 'Báo cáo kết quả kinh doanh (Income Statement) là báo cáo tài chính phản ánh tình hình và kết quả hoạt động kinh doanh của doanh nghiệp trong một kỳ kế toán nhất định.\n\nBáo cáo này cho biết doanh nghiệp có lãi hay lỗ trong kỳ.' },
      { title: 'Cấu trúc báo cáo', content: '1. Doanh thu bán hàng và cung cấp dịch vụ\n2. Các khoản giảm trừ doanh thu\n3. Doanh thu thuần\n4. Giá vốn hàng bán\n5. Lợi nhuận gộp\n6. Chi phí bán hàng\n7. Chi phí quản lý doanh nghiệp\n8. Lợi nhuận thuần từ hoạt động kinh doanh' },
      { title: 'Công thức tính', content: 'Lợi nhuận gộp = Doanh thu thuần - Giá vốn hàng bán\n\nLợi nhuận thuần = Lợi nhuận gộp - Chi phí bán hàng - Chi phí QLDN\n\nLợi nhuận sau thuế = Lợi nhuận trước thuế - Thuế TNDN' },
      { title: 'Ví dụ minh họa', content: 'Công ty ABC:\n- Doanh thu: 10.000.000.000 VNĐ\n- Giá vốn: 6.000.000.000 VNĐ\n- CP bán hàng: 1.000.000.000 VNĐ\n- CP QLDN: 1.500.000.000 VNĐ\n\n→ Lợi nhuận gộp: 4.000.000.000 VNĐ\n→ Lợi nhuận thuần: 1.500.000.000 VNĐ' },
      { title: 'Tóm tắt', content: '• Báo cáo KQKD phản ánh hiệu quả hoạt động\n• Gồm các chỉ tiêu: doanh thu, chi phí, lợi nhuận\n• Lập theo kỳ: tháng, quý, năm\n• Là cơ sở để đánh giá hiệu quả và ra quyết định' },
    ],
  };

  const slide = lesson.slides[currentSlide];
  const progress = Math.round(((currentSlide + 1) / lesson.totalSlides) * 100);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text type="secondary">{lesson.course} &gt; {lesson.chapter}</Text>
          <Title level={4} style={{ margin: 0 }}>{lesson.title}</Title>
        </div>
        <Space>
          <Tooltip title="Bookmark"><Button icon={<StarOutlined />} /></Tooltip>
          <Tooltip title="Ghi chú"><Button icon={<HighlightOutlined />} /></Tooltip>
          <Tooltip title="AI Chat"><Button icon={<MessageOutlined />} type="primary" /></Tooltip>
        </Space>
      </div>

      {/* Progress */}
      <Progress percent={progress} format={() => `${currentSlide + 1} / ${lesson.totalSlides}`} style={{ marginBottom: 16 }} />

      {/* Slide Content */}
      <Card style={{ minHeight: 400, marginBottom: 16 }}>
        <Tag color="blue" style={{ marginBottom: 12 }}>{slide.title}</Tag>
        <Paragraph style={{ fontSize: 16, whiteSpace: 'pre-line', lineHeight: 1.8 }}>
          {slide.content}
        </Paragraph>
      </Card>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button icon={<LeftOutlined />} disabled={currentSlide === 0} onClick={() => setCurrentSlide(currentSlide - 1)}>
          Trước
        </Button>
        <Text>{currentSlide + 1} / {lesson.totalSlides}</Text>
        <Button type="primary" disabled={currentSlide === lesson.totalSlides - 1} onClick={() => setCurrentSlide(currentSlide + 1)}>
          Tiếp <RightOutlined />
        </Button>
      </div>
    </div>
  );
}

export default LessonViewerPage;
