import { Card, Form, Input, Switch, Button, Typography, Divider, Row, Col, InputNumber, Select, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function SystemConfigPage() {
  const [form] = Form.useForm();

  const onSave = () => {
    message.success('Cấu hình đã được lưu!');
  };

  return (
    <div>
      <Title level={3}>Cấu hình hệ thống</Title>

      <Form form={form} layout="vertical" onFinish={onSave} initialValues={{
        platformName: 'H-T.Study',
        supportEmail: 'support@htstudy.uk',
        sessionTimeout: 60,
        maxUploadSize: 100,
        maintenanceMode: false,
        aiModel: 'gpt-4o',
        aiTemperature: 0.7,
        aiMaxLength: 2000,
        aiChatEnabled: true,
        aiExplainEnabled: true,
        aiQuizGenEnabled: true,
        aiSlideGenEnabled: true,
        aiVoiceGenEnabled: true,
        aiRecommendEnabled: true,
        aiMaterialSearchEnabled: true,
      }}>
        {/* General Settings */}
        <Card title="Cấu hình chung" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="platformName" label="Tên platform">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="supportEmail" label="Email hỗ trợ">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="sessionTimeout" label="Session timeout (phút)">
                <InputNumber min={5} max={1440} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="maxUploadSize" label="Giới hạn upload (MB)">
                <InputNumber min={1} max={500} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="maintenanceMode" label="Chế độ bảo trì" valuePropName="checked">
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>
              <Text type="secondary">Khi bật, tất cả user (trừ Admin) sẽ thấy trang bảo trì.</Text>
            </Col>
          </Row>
        </Card>

        {/* AI Configuration */}
        <Card title="Cấu hình AI" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="aiModel" label="AI Model">
                <Select>
                  <Select.Option value="gpt-4o">GPT-4o</Select.Option>
                  <Select.Option value="gpt-4o-mini">GPT-4o Mini</Select.Option>
                  <Select.Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="aiTemperature" label="Temperature (0-2)">
                <InputNumber min={0} max={2} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="aiMaxLength" label="Max response length">
                <InputNumber min={100} max={10000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Feature Toggles</Divider>
          <Row gutter={[16, 8]}>
            <Col xs={12} md={8}><Form.Item name="aiChatEnabled" valuePropName="checked"><Switch /> <Text>AI Chat</Text></Form.Item></Col>
            <Col xs={12} md={8}><Form.Item name="aiExplainEnabled" valuePropName="checked"><Switch /> <Text>AI Explain</Text></Form.Item></Col>
            <Col xs={12} md={8}><Form.Item name="aiQuizGenEnabled" valuePropName="checked"><Switch /> <Text>Quiz Generation</Text></Form.Item></Col>
            <Col xs={12} md={8}><Form.Item name="aiSlideGenEnabled" valuePropName="checked"><Switch /> <Text>Slide Generation</Text></Form.Item></Col>
            <Col xs={12} md={8}><Form.Item name="aiVoiceGenEnabled" valuePropName="checked"><Switch /> <Text>Voice Generation</Text></Form.Item></Col>
            <Col xs={12} md={8}><Form.Item name="aiRecommendEnabled" valuePropName="checked"><Switch /> <Text>Recommendation</Text></Form.Item></Col>
            <Col xs={12} md={8}><Form.Item name="aiMaterialSearchEnabled" valuePropName="checked"><Switch /> <Text>Material Search</Text></Form.Item></Col>
          </Row>
        </Card>

        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
          Lưu cấu hình
        </Button>
      </Form>
    </div>
  );
}

export default SystemConfigPage;
