import { useState } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Tag, Space } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, BookOutlined, LinkOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  materials?: { title: string; type: string; accessible: boolean }[];
  timestamp: string;
}

function AIChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! Tôi là AI trợ lý học tập của H-T.Study. Bạn có thể hỏi tôi bất kỳ câu hỏi nào về kiến thức, và tôi sẽ tìm tài liệu liên quan trên hệ thống để giúp bạn.',
      timestamp: '10:00',
    },
    {
      id: '2',
      role: 'user',
      content: 'Giải thích cho tôi về phương trình kế toán cơ bản?',
      timestamp: '10:01',
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Phương trình kế toán cơ bản là: Tài sản = Nợ phải trả + Vốn chủ sở hữu. Đây là nền tảng của mọi hệ thống kế toán kép, đảm bảo rằng mọi giao dịch đều được ghi nhận cân bằng giữa hai vế.\n\nTài sản bao gồm: tiền mặt, hàng tồn kho, tài sản cố định...\nNợ phải trả: các khoản phải trả nhà cung cấp, vay ngắn hạn...\nVốn chủ sở hữu: vốn góp, lợi nhuận chưa phân phối...',
      materials: [
        { title: 'Bài 2: Phương trình kế toán', type: 'Bài học', accessible: true },
        { title: 'Quiz: Nguyên lý kế toán', type: 'Quiz', accessible: true },
        { title: 'Bài 4: Bảng cân đối kế toán', type: 'Bài học', accessible: false },
      ],
      timestamp: '10:01',
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Đây là câu trả lời mẫu. Khi có backend, AI sẽ phân tích câu hỏi và tìm kiếm tài liệu liên quan trên toàn bộ hệ thống.',
        materials: [
          { title: 'Tài liệu liên quan 1', type: 'Bài học', accessible: true },
        ],
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
      <Card
        title={<><RobotOutlined /> AI Chat - Tìm tài liệu & Giải đáp kiến thức</>}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        bodyStyle={{ flex: 1, overflow: 'auto', padding: 16 }}
      >
        <List
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item style={{ border: 'none', padding: '8px 0' }}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <Avatar icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} style={{ backgroundColor: msg.role === 'user' ? '#1677ff' : '#52c41a' }} />
                  <div style={{ maxWidth: '70%', background: msg.role === 'user' ? '#e6f4ff' : '#f6ffed', padding: '12px 16px', borderRadius: 12 }}>
                    <Paragraph style={{ margin: 0, whiteSpace: 'pre-line' }}>{msg.content}</Paragraph>
                    {msg.materials && (
                      <div style={{ marginTop: 12, borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}><BookOutlined /> Tài liệu liên quan:</Text>
                        <Space direction="vertical" size={4} style={{ marginTop: 4, width: '100%' }}>
                          {msg.materials.map((mat, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <LinkOutlined />
                              <Text style={{ fontSize: 13 }}>{mat.title}</Text>
                              <Tag color={mat.accessible ? 'green' : 'red'} style={{ fontSize: 11 }}>
                                {mat.accessible ? mat.type : '🔒 Khóa'}
                              </Tag>
                            </div>
                          ))}
                        </Space>
                      </div>
                    )}
                    <Text type="secondary" style={{ fontSize: 11 }}>{msg.timestamp}</Text>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* Input area */}
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi bất kỳ kiến thức nào... AI sẽ tìm tài liệu liên quan"
          autoSize={{ minRows: 1, maxRows: 3 }}
          onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <Button type="primary" icon={<SendOutlined />} onClick={handleSend} style={{ height: 'auto' }}>
          Gửi
        </Button>
      </div>
    </div>
  );
}

export default AIChatPage;
