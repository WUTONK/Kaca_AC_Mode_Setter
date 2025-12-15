import React from 'react'
import { Card, Form, Button, Typography, Toast, Divider, Switch, Input } from '@douyinfe/semi-ui'
import { IconFolder, IconSave } from '@douyinfe/semi-icons'
import { useApp } from '../AppContext'

const { Title, Text } = Typography

const Settings: React.FC = () => {
  const { settings, setSettings } = useApp()

  const handleSave = (): void => {
    Toast.success('设置已保存')
  }

  const handleBrowse = (field: string): void => {
    // 实际 Electron 中调用 dialog.showOpenDialog
    console.log(`Browse for: ${field}`)
    Toast.info('实际环境中将打开文件选择对话框')
  }

  return (
    <div style={{ padding: '24px', maxWidth: 800 }}>
      <Title heading={3} style={{ marginBottom: 20 }}>
        系统设置
      </Title>

      <Card title="路径配置" style={{ marginBottom: 20 }}>
        <Form
          initValues={settings}
          onValueChange={(values) => setSettings((prev) => ({ ...prev, ...values }))}
        >
          <Form.Slot label="AC 根目录">
            <div style={{ display: 'flex', gap: 8 }}>
              <Input
                value={settings.acRootPath}
                onChange={(value) => setSettings((prev) => ({ ...prev, acRootPath: value }))}
                style={{ flex: 1 }}
              />
              <Button icon={<IconFolder />} onClick={() => handleBrowse('acRootPath')}>
                浏览
              </Button>
            </div>
            <Text type="tertiary" size="small" style={{ marginTop: 4 }}>
              Assetto Corsa 游戏的安装目录
            </Text>
          </Form.Slot>

          <Form.Slot label="存储路径">
            <div style={{ display: 'flex', gap: 8 }}>
              <Input
                value={settings.storagePath}
                onChange={(value) => setSettings((prev) => ({ ...prev, storagePath: value }))}
                style={{ flex: 1 }}
              />
              <Button icon={<IconFolder />} onClick={() => handleBrowse('storagePath')}>
                浏览
              </Button>
            </div>
            <Text type="tertiary" size="small" style={{ marginTop: 4 }}>
              车包模式的备份存储位置
            </Text>
          </Form.Slot>
        </Form>
      </Card>

      <Card title="门店配置" style={{ marginBottom: 20 }}>
        <Form>
          <Form.Slot label="门店标识">
            <Input
              value={settings.storeName}
              onChange={(value) => setSettings((prev) => ({ ...prev, storeName: value }))}
              placeholder="如: kaca_01"
              style={{ width: 200 }}
            />
            <Text type="tertiary" size="small" style={{ marginTop: 4 }}>
              用于标识本机在同步网络中的身份
            </Text>
          </Form.Slot>
        </Form>
      </Card>

      <Card title="同步设置" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text strong>自动接受同步</Text>
            <br />
            <Text type="tertiary" size="small">
              开启后，本机将自动接受来自其他门店的模式同步
            </Text>
          </div>
          <Switch
            checked={settings.autoAcceptSync}
            onChange={(checked) => setSettings((prev) => ({ ...prev, autoAcceptSync: checked }))}
          />
        </div>
      </Card>

      <Divider />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <Button type="tertiary">重置</Button>
        <Button type="primary" icon={<IconSave />} onClick={handleSave}>
          保存设置
        </Button>
      </div>
    </div>
  )
}

export default Settings

