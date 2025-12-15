import React from 'react'
import { Layout, Button, Space, Badge } from '@douyinfe/semi-ui'
import { IconMinus, IconClose, IconExpand, IconCode } from '@douyinfe/semi-icons'
import { useApp } from '../AppContext'

const { Header } = Layout

const TitleBar: React.FC = () => {
  const { setDevModeVisible, processes } = useApp()
  const hasWarning = processes.cmRunning || processes.gameRunning

  // Electron 窗口操作
  const handleWindowControl = (action: string): void => {
    window.electron.ipcRenderer.send('window-control', action)
  }

  return (
    <Header
      style={{
        height: '40px',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderBottom: '1px solid var(--semi-color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
        WebkitAppRegion: 'drag',
        flexShrink: 0
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center' }}>
        <span>AC Manager Pro</span>
        {hasWarning && (
          <Badge dot type="danger" style={{ marginLeft: 8 }}>
            进程占用中
          </Badge>
        )}
      </div>

      <div style={{ WebkitAppRegion: 'no-drag', display: 'flex', gap: 12 }}>
        {/* 开发者按钮 */}
        <Button
          theme="borderless"
          icon={<IconCode />}
          size="small"
          type={hasWarning ? 'warning' : 'secondary'}
          onClick={() => setDevModeVisible(true)}
        >
          Dev
        </Button>

        <Space spacing={4}>
          <Button
            theme="borderless"
            icon={<IconMinus size="small" />}
            size="small"
            onClick={() => handleWindowControl('minimize')}
          />
          <Button
            theme="borderless"
            icon={<IconExpand size="small" />}
            size="small"
            onClick={() => handleWindowControl('maximize')}
          />
          <Button
            theme="borderless"
            type="danger"
            icon={<IconClose size="small" />}
            size="small"
            onClick={() => handleWindowControl('close')}
          />
        </Space>
      </div>
    </Header>
  )
}

export default TitleBar

