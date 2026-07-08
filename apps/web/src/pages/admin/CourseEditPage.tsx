import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Form, Input, Select, Space, Collapse, List, Modal, Upload, Tag, Popconfirm, message, Spin, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, FileOutlined, ArrowLeftOutlined, SaveOutlined, BookOutlined, SendOutlined } from '@ant-design/icons';
import { apiClient } from '../../api';

const { Title, Text } = Typography;
const { TextArea } = Input;

function CourseEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);
  const [activeChapterId, setActiveChapterId] = useState<string>('');
  const [form] = Form.useForm();
  const [chapterForm] = Form.useForm();
  const [lessonForm] = Form.useForm();

  useEffect(() => {
    if (id) {
      apiClient.get(`/courses/${id}`).then((res) => {
        setCourse(res.data.data);
        form.setFieldsValue(res.data.data);
      }).catch(() => message.error('Không tải được khóa học'));
      // TODO: Load chapters from API when available
      setChapters([]);
    }
    setLoading(false);
  }, [id]);

  const handleSaveCourse = async (values: any) => {
    setSaving(true);
    try {
      if (id) {
        await apiClient.put(`/courses/${id}`, values);
        message.success('Đã cập nhật khóa học');
      } else {
        const res = await apiClient.post('/courses', values);
        message.success('Đã tạo khóa học');
        navigate(`/admin/courses/${res.data.data.id}`);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi lưu');
    }
    setSaving(false);
  };

  const handleDeleteCourse = async () => {
    try {
      await apiClient.delete(`/courses/${id}`);
      message.success('Đã xóa khóa học');
      navigate('/admin/content');
    } catch (err: any) {
      message.error('Lỗi xóa');
    }
  };

  const handleAddChapter = (values: any) => {
    const newChapter = {
      id: Date.now().toString(),
      title: values.title,
      description: values.description,
      sortOrder: chapters.length + 1,
      lessons: [],
    };
    setChapters([...chapters, newChapter]);
    setChapterModalOpen(false);
    chapterForm.resetFields();
    message.success('Đã thêm chương');
  };

  const handleDeleteChapter = (chapterId: string) => {
    setChapters(chapters.filter((c) => c.id !== chapterId));
    message.success('Đã xóa chương');
  };

  const handleAddLesson = (values: any) => {
    setChapters(chapters.map((ch) => {
      if (ch.id === activeChapterId) {
        return { ...ch, lessons: [...(ch.lessons || []), { id: Date.now().toString(), ...values }] };
      }
      return ch;
    }));
    setLessonModalOpen(false);
    lessonForm.resetFields();
    message.success('Đã thêm bài học');
  };

  const handleDeleteLesson = (chapterId: string, lessonId: string) => {
    setChapters(chapters.map((ch) => {
      if (ch.id === chapterId) {
        return { ...ch, lessons: ch.lessons.filter((l: any) => l.id !== lessonId) };
      }
      return ch;
    }));
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/content')}>Quay lại</Button>
          <Title level={4} style={{ margin: 0 }}>{id ? 'Sửa khóa học' : 'Tạo khóa học mới'}</Title>
          {course?.status && <Tag color={
            course.status === 'published' ? 'green' :
            course.status === 'pending_review' ? 'blue' :
            course.status === 'rejected' ? 'red' : 'default'
          }>{
            course.status === 'published' ? 'Đã xuất bản' :
            course.status === 'pending_review' ? 'Chờ duyệt' :
            course.status === 'rejected' ? 'Từ chối' : 'Nháp'
          }</Tag>}
        </Space>
        <Space>
          {id && course?.status === 'draft' && (
            <Button icon={<SendOutlined />} onClick={async () => {
              try {
                await apiClient.post(`/courses/${id}/submit`);
                message.success('Đã gửi duyệt');
                apiClient.get(`/courses/${id}`).then((res) => setCourse(res.data.data));
              } catch (err: any) { message.error(err.response?.data?.message || 'Lỗi'); }
            }}>Gửi duyệt</Button>
          )}
          {id && course?.status === 'rejected' && (
            <Button icon={<SendOutlined />} onClick={async () => {
              try {
                await apiClient.post(`/courses/${id}/submit`);
                message.success('Đã gửi duyệt lại');
                apiClient.get(`/courses/${id}`).then((res) => setCourse(res.data.data));
              } catch (err: any) { message.error(err.response?.data?.message || 'Lỗi'); }
            }}>Gửi duyệt lại</Button>
          )}
          {id && (
            <Popconfirm title="Xóa khóa học này?" onConfirm={handleDeleteCourse}>
              <Button danger icon={<DeleteOutlined />}>Xóa</Button>
            </Popconfirm>
          )}
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={() => form.submit()}>
            Lưu
          </Button>
        </Space>
      </div>

      {/* Course Info */}
      <Card title="Thông tin khóa học" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" onFinish={handleSaveCourse} initialValues={course || { accessType: 'free' }}>
          <Form.Item name="title" label="Tên khóa học" rules={[{ required: true }]}>
            <Input placeholder="VD: Phân tích đầu tư chứng khoán" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Mô tả ngắn gọn về khóa học..." />
          </Form.Item>
          <Space>
            <Form.Item name="accessType" label="Loại truy cập">
              <Select style={{ width: 150 }}>
                <Select.Option value="free">Miễn phí</Select.Option>
                <Select.Option value="locked">Khóa (điểm)</Select.Option>
                <Select.Option value="premium">Premium</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="pointCost" label="Điểm mở khóa">
              <Input type="number" placeholder="0" style={{ width: 100 }} />
            </Form.Item>
          </Space>
        </Form>
      </Card>

      {/* Chapters & Lessons */}
      <Card title={<><BookOutlined /> Nội dung khóa học ({chapters.length} chương)</>}
        extra={<Button icon={<PlusOutlined />} onClick={() => setChapterModalOpen(true)}>Thêm chương</Button>}>

        {chapters.length === 0 && <Text type="secondary">Chưa có chương nào. Nhấn "Thêm chương" để bắt đầu.</Text>}

        <Collapse accordion items={chapters.map((chapter, idx) => ({
          key: chapter.id,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Text strong>Chương {idx + 1}: {chapter.title}</Text>
              <Space onClick={(e) => e.stopPropagation()}>
                <Button size="small" icon={<PlusOutlined />} onClick={() => { setActiveChapterId(chapter.id); setLessonModalOpen(true); }}>Thêm bài</Button>
                <Popconfirm title="Xóa chương?" onConfirm={() => handleDeleteChapter(chapter.id)}>
                  <Button size="small" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            </div>
          ),
          children: (
            <div>
              {chapter.description && <Text type="secondary">{chapter.description}</Text>}
              <List
                dataSource={chapter.lessons || []}
                locale={{ emptyText: 'Chưa có bài học' }}
                renderItem={(lesson: any, lessonIdx: number) => (
                  <List.Item actions={[
                    <Button size="small" icon={<EditOutlined />}>Sửa</Button>,
                    <Popconfirm title="Xóa bài?" onConfirm={() => handleDeleteLesson(chapter.id, lesson.id)}>
                      <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>,
                  ]}>
                    <List.Item.Meta
                      avatar={<Tag>{lessonIdx + 1}</Tag>}
                      title={lesson.title}
                      description={lesson.contentType && <Tag color="blue">{lesson.contentType}</Tag>}
                    />
                  </List.Item>
                )}
              />
            </div>
          ),
        }))} />
      </Card>

      {/* Upload tài liệu */}
      <Card title="Upload tài liệu khóa học" style={{ marginTop: 16 }}>
        <Text type="secondary">Upload file PDF, Word, PowerPoint để tạo nội dung bài học tự động.</Text>
        <Upload.Dragger
          multiple
          accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.txt"
          beforeUpload={(file) => {
            message.info(`Đã chọn: ${file.name} — tính năng xử lý file sẽ hoạt động khi có OpenAI API key`);
            return false; // Prevent auto upload
          }}
          style={{ marginTop: 12 }}
        >
          <p><UploadOutlined style={{ fontSize: 32, color: '#1677ff' }} /></p>
          <p>Kéo thả file hoặc click để chọn</p>
          <p style={{ color: '#999' }}>Hỗ trợ: PDF, Word, PowerPoint, Excel, Text</p>
        </Upload.Dragger>
      </Card>

      {/* Modal thêm chương */}
      <Modal title="Thêm chương mới" open={chapterModalOpen} onCancel={() => setChapterModalOpen(false)} onOk={() => chapterForm.submit()} okText="Thêm">
        <Form form={chapterForm} layout="vertical" onFinish={handleAddChapter}>
          <Form.Item name="title" label="Tên chương" rules={[{ required: true }]}>
            <Input placeholder="VD: Chương 1: Tổng quan" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả (tùy chọn)">
            <TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm bài học */}
      <Modal title="Thêm bài học" open={lessonModalOpen} onCancel={() => setLessonModalOpen(false)} onOk={() => lessonForm.submit()} okText="Thêm">
        <Form form={lessonForm} layout="vertical" onFinish={handleAddLesson}>
          <Form.Item name="title" label="Tên bài học" rules={[{ required: true }]}>
            <Input placeholder="VD: Bài 1: Giới thiệu" />
          </Form.Item>
          <Form.Item name="contentType" label="Loại nội dung" initialValue="text">
            <Select>
              <Select.Option value="text">Văn bản</Select.Option>
              <Select.Option value="slide">Slide</Select.Option>
              <Select.Option value="video">Video</Select.Option>
              <Select.Option value="mixed">Hỗn hợp</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="Nội dung">
            <TextArea rows={5} placeholder="Nhập nội dung bài học hoặc để trống (import sau từ file)..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CourseEditPage;
