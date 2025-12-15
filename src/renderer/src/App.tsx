import React, { useState } from 'react'
import { Layout, Nav } from '@douyinfe/semi-ui'
import { IconHome, IconCloud, IconSetting, IconAppCenter } from '@douyinfe/semi-icons'
import { AppProvider } from './AppContext'
import TitleBar from './components/TitleBar'
import DevTools from './components/DevTools'
import ModeSwitcher from './pages/ModeSwitcher'
import SyncCenter from './pages/SyncCenter'
import Settings from './pages/Settings'

const { Sider, Content } = Layout

// 模式管理占位页
const ModeManager: React.FC = () => (
  <div style={{ padding: 24 }}>
    <h2>模式管理</h2>
    <p style={{ color: 'var(--semi-color-text-2)' }}>此功能正在开发中...</p>
  </div>
)

type PageKey = 'home' | 'manager' | 'sync' | 'settings'

const AppContent: React.FC = () => {
  const [page, setPage] = useState<PageKey>('home')

  const renderContent = (): React.ReactNode => {
    switch (page) {
      case 'home':
        return <ModeSwitcher />
      case 'manager':
        return <ModeManager />
      case 'sync':
        return <SyncCenter />
      case 'settings':
        return <Settings />
      default:
        return <ModeSwitcher />
    }
  }

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
      {/* 侧边栏 */}
      <Sider
        style={{
          backgroundColor: 'var(--semi-color-bg-1)',
          borderRight: '1px solid var(--semi-color-border)',
          width: 220,
          flexShrink: 0
        }}
      >
        <div
          style={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            WebkitAppRegion: 'drag',
            borderBottom: '1px solid var(--semi-color-border)'
          }}
        >
          <span style={{ fontWeight: 800, color: 'var(--semi-color-primary)' }}>AC STORE</span>
        </div>
        <Nav
          defaultSelectedKeys={['home']}
          onSelect={(data) => setPage(data.itemKey as PageKey)}
          style={{ height: 'calc(100% - 40px)' }}
          items={[
            { itemKey: 'home', text: '模式切换', icon: <IconHome /> },
            { itemKey: 'manager', text: '模式管理', icon: <IconAppCenter /> },
            { itemKey: 'sync', text: '店内同步', icon: <IconCloud /> },
            { itemKey: 'settings', text: '系统设置', icon: <IconSetting /> }
          ]}
        />
      </Sider>

      {/* 右侧主区域 */}
      <Layout style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TitleBar />
        <Content
          style={{
            backgroundColor: 'var(--semi-color-bg-0)',
            overflowY: 'auto',
            flex: 1,
            position: 'relative'
          }}
        >
          {renderContent()}
        </Content>
      </Layout>

      {/* 全局开发者面板 */}
      <DevTools />
    </Layout>
  )
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
