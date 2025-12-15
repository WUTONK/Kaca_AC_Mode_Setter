import React, { useState } from 'react'
import {
  Card,
  Button,
  Progress,
  Tag,
  Input,
  Typography,
  Modal,
  Toast,
  Banner
} from '@douyinfe/semi-ui'
import { IconSearch, IconCopy, IconPlay, IconAlertTriangle } from '@douyinfe/semi-icons'
import { useApp, Mode } from '../AppContext'

const { Text, Title } = Typography

const ModeSwitcher: React.FC = () => {
  const { modes, switchMode, currentModeId, processes } = useApp()
  const [filterText, setFilterText] = useState<string>('')
  const [processing, setProcessing] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  // ⚠️ 核心防呆检查
  const isBlocked = processes.cmRunning || processes.gameRunning

  const handleActivate = async (mode: Mode): Promise<void> => {
    if (processing) return
    if (isBlocked) {
      Modal.error({
        title: '无法操作',
        content: '检测到游戏或CM正在运行，请先关闭相关程序以释放文件占用。'
      })
      return
    }

    setProcessing(true)
    setProgress(0)

    // 模拟进度条逻辑
    let p = 0
    const timer = setInterval(() => {
      p += 10
      setProgress(p)
      if (p >= 90) clearInterval(timer)
    }, 200)

    try {
      await switchMode(mode.id)
      setProgress(100)
      Toast.success(`成功切换至：${mode.name}`)
    } catch (e) {
      Toast.error((e as Error).message)
    } finally {
      setTimeout(() => {
        setProcessing(false)
        setProgress(0)
      }, 500)
    }
  }

  const filteredModes = modes.filter((m) => m.name.includes(filterText))

  return (
    <div style={{ padding: '24px' }}>
      {/* ⚠️ 顶部警告条 */}
      {isBlocked && (
        <Banner
          type="danger"
          icon={<IconAlertTriangle />}
          closeIcon={null}
          title="检测到程序占用"
          description="Content Manager 或 Assetto Corsa 正在运行。切换车包需要修改核心文件，请务必先关闭游戏，否则更改无法生效且可能损坏文件。"
          style={{ marginBottom: 20 }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title heading={3}>车包模式切换</Title>
        <Input
          prefix={<IconSearch />}
          placeholder="搜索..."
          value={filterText}
          onChange={(value) => setFilterText(value)}
          style={{ width: 250 }}
        />
      </div>

      {processing && (
        <div
          style={{
            marginBottom: 20,
            padding: 20,
            background: 'var(--semi-color-fill-0)',
            borderRadius: 8
          }}
        >
          <Text strong>正在迁移数据...</Text>
          <Progress percent={progress} style={{ marginTop: 8 }} showInfo />
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}
      >
        {filteredModes.map((mode) => (
          <Card
            key={mode.id}
            shadows="hover"
            style={{ opacity: isBlocked && mode.id !== currentModeId ? 0.6 : 1 }}
            title={
              <Text strong style={{ fontSize: 16 }}>
                {mode.name}
              </Text>
            }
            headerExtraContent={
              mode.id === currentModeId ? <Tag color="green">当前运行</Tag> : null
            }
          >
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary">{mode.description}</Text>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <Tag color="blue" type="ghost">
                {mode.size}
              </Tag>
              <Tag color="violet" type="ghost">
                {mode.carCount}台
              </Tag>
            </div>

            <Button
              theme={mode.id === currentModeId ? 'solid' : 'light'}
              type={mode.id === currentModeId ? 'tertiary' : 'primary'}
              block
              // ⚠️ 禁用逻辑：正在处理 或 (被进程阻塞 且 不是当前正在跑的模式)
              disabled={processing || mode.id === currentModeId || isBlocked}
              icon={mode.id === currentModeId ? <IconPlay /> : <IconCopy />}
              onClick={() => handleActivate(mode)}
            >
              {isBlocked
                ? '请先关闭游戏'
                : mode.id === currentModeId
                  ? '运行中'
                  : '切换至此'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ModeSwitcher

