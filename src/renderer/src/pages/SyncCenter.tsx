import React, { useState } from 'react'
import {
  Card,
  Button,
  Progress,
  Tag,
  Typography,
  Toast,
  List,
  Avatar,
  Banner
} from '@douyinfe/semi-ui'
import { IconSync, IconCloud, IconCheckCircleStroked, IconClock } from '@douyinfe/semi-icons'
import { useApp } from '../AppContext'

const { Text, Title } = Typography

interface SyncRecord {
  id: number
  storeName: string
  time: string
  status: 'success' | 'pending' | 'failed'
  modesCount: number
}

const MOCK_SYNC_RECORDS: SyncRecord[] = [
  { id: 1, storeName: 'kaca_01', time: '2024-01-15 14:30', status: 'success', modesCount: 3 },
  { id: 2, storeName: 'kaca_02', time: '2024-01-15 12:00', status: 'success', modesCount: 5 },
  { id: 3, storeName: 'kaca_03', time: '2024-01-14 18:45', status: 'pending', modesCount: 2 }
]

const SyncCenter: React.FC = () => {
  const { settings, processes } = useApp()
  const [syncing, setSyncing] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [records] = useState<SyncRecord[]>(MOCK_SYNC_RECORDS)

  const isBlocked = processes.cmRunning || processes.gameRunning

  const handleSync = async (): Promise<void> => {
    if (syncing || isBlocked) return

    setSyncing(true)
    setProgress(0)

    // 模拟同步进度
    let p = 0
    const timer = setInterval(() => {
      p += 5
      setProgress(p)
      if (p >= 100) {
        clearInterval(timer)
        setSyncing(false)
        Toast.success('同步完成！')
      }
    }, 100)
  }

  const getStatusTag = (status: SyncRecord['status']): React.ReactNode => {
    switch (status) {
      case 'success':
        return (
          <Tag color="green" prefixIcon={<IconCheckCircleStroked />}>
            已同步
          </Tag>
        )
      case 'pending':
        return (
          <Tag color="orange" prefixIcon={<IconClock />}>
            待同步
          </Tag>
        )
      default:
        return <Tag color="red">失败</Tag>
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title heading={3} style={{ marginBottom: 20 }}>
        店内同步中心
      </Title>

      {isBlocked && (
        <Banner
          type="warning"
          closeIcon={null}
          title="同步功能受限"
          description="检测到游戏正在运行，部分同步功能可能无法正常执行。"
          style={{ marginBottom: 20 }}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <Card title="本机状态">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">门店标识</Text>
              <Text strong>{settings.storeName}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">存储路径</Text>
              <Text code style={{ fontSize: 12 }}>
                {settings.storagePath}
              </Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">自动同步</Text>
              <Tag color={settings.autoAcceptSync ? 'green' : 'grey'}>
                {settings.autoAcceptSync ? '已开启' : '已关闭'}
              </Tag>
            </div>
          </div>
        </Card>

        <Card title="快速操作">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Button
              icon={<IconSync spin={syncing} />}
              type="primary"
              block
              loading={syncing}
              disabled={isBlocked}
              onClick={handleSync}
            >
              {syncing ? '同步中...' : '立即同步'}
            </Button>
            {syncing && <Progress percent={progress} showInfo />}
            <Button icon={<IconCloud />} theme="light" block disabled={isBlocked}>
              从云端拉取
            </Button>
          </div>
        </Card>
      </div>

      <Card title="同步记录">
        <List
          dataSource={records}
          renderItem={(item) => (
            <List.Item
              header={<Avatar size="small" color="blue">{item.storeName.slice(-2)}</Avatar>}
              main={
                <div>
                  <Text strong>{item.storeName}</Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    {item.time}
                  </Text>
                </div>
              }
              extra={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tag color="blue">{item.modesCount} 个模式</Tag>
                  {getStatusTag(item.status)}
                </div>
              }
            />
          )}
        />
      </Card>
    </div>
  )
}

export default SyncCenter

