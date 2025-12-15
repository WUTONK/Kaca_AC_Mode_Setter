import React from 'react'
import { SideSheet, Descriptions, Switch, Button, Divider, Typography } from '@douyinfe/semi-ui'
import { useApp } from '../AppContext'

const { Text } = Typography

const DevTools: React.FC = () => {
  const { devModeVisible, setDevModeVisible, processes, toggleProcessState, currentModeId } =
    useApp()

  return (
    <SideSheet
      title="开发者调试清单"
      visible={devModeVisible}
      onCancel={() => setDevModeVisible(false)}
      width={300}
    >
      <Text strong>环境状态模拟</Text>
      <div
        style={{
          margin: '12px 0',
          padding: 12,
          border: '1px dashed var(--semi-color-warning)',
          borderRadius: 6
        }}
      >
        <p style={{ marginBottom: 8, fontSize: 12 }}>模拟外部程序运行（触发防呆警告）：</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Content Manager 运行中</span>
          <Switch checked={processes.cmRunning} onChange={() => toggleProcessState('cmRunning')} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>ACS.exe (游戏) 运行中</span>
          <Switch
            checked={processes.gameRunning}
            onChange={() => toggleProcessState('gameRunning')}
          />
        </div>
      </div>

      <Divider margin="12px" />

      <Text strong>内部数据检视</Text>
      <Descriptions align="left" style={{ marginTop: 10 }}>
        <Descriptions.Item itemKey="Current Mode ID">{currentModeId}</Descriptions.Item>
        <Descriptions.Item itemKey="Electron IPC">Mocked</Descriptions.Item>
        <Descriptions.Item itemKey="Node Env">Development</Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 20 }}>
        <Button block type="danger" onClick={() => window.location.reload()}>
          强制重载 UI (F5)
        </Button>
      </div>
    </SideSheet>
  )
}

export default DevTools

