import React, { createContext, useState, useContext, ReactNode } from 'react'

// 类型定义
export interface Mode {
  id: number
  name: string
  type: 'guest' | 'race' | 'custom'
  size: string
  carCount: number
  isInstalled: boolean
  description: string
}

export interface Settings {
  acRootPath: string
  storagePath: string
  autoAcceptSync: boolean
  storeName: string
}

export interface Processes {
  cmRunning: boolean
  gameRunning: boolean
}

interface AppContextType {
  modes: Mode[]
  setModes: React.Dispatch<React.SetStateAction<Mode[]>>
  currentModeId: number
  switchMode: (modeId: number) => Promise<void>
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  devModeVisible: boolean
  setDevModeVisible: React.Dispatch<React.SetStateAction<boolean>>
  processes: Processes
  toggleProcessState: (key: keyof Processes) => void
}

const INITIAL_MODES: Mode[] = [
  {
    id: 1,
    name: '游客模式 (默认)',
    type: 'guest',
    size: '2.5GB',
    carCount: 20,
    isInstalled: true,
    description: '基础原厂车与热门街车'
  },
  {
    id: 2,
    name: '比赛模式 (GT3)',
    type: 'race',
    size: '15GB',
    carCount: 45,
    isInstalled: false,
    description: '全套GT3赛车与BoP设置'
  },
  {
    id: 3,
    name: '漂移专用',
    type: 'custom',
    size: '8.2GB',
    carCount: 12,
    isInstalled: false,
    description: '包含地下街车与漂移赛道包'
  }
]

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // 业务状态
  const [modes, setModes] = useState<Mode[]>(INITIAL_MODES)
  const [currentModeId, setCurrentModeId] = useState<number>(1)
  const [settings, setSettings] = useState<Settings>({
    acRootPath: 'C:/Steam/assettocorsa',
    storagePath: 'D:/AC_MOD_STORAGE',
    autoAcceptSync: false,
    storeName: 'kaca_01'
  })

  // 系统状态 & 开发者状态
  const [devModeVisible, setDevModeVisible] = useState<boolean>(false)
  const [processes, setProcesses] = useState<Processes>({
    cmRunning: false,
    gameRunning: false
  })

  // 模拟切换模式
  const switchMode = (modeId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 安全检查
      if (processes.cmRunning || processes.gameRunning) {
        return reject(new Error('请先关闭游戏或启动器'))
      }
      setTimeout(() => {
        setModes(modes.map((m) => ({ ...m, isInstalled: m.id === modeId })))
        setCurrentModeId(modeId)
        resolve()
      }, 3000)
    })
  }

  // 切换进程状态（开发者面板用）
  const toggleProcessState = (key: keyof Processes): void => {
    setProcesses((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <AppContext.Provider
      value={{
        modes,
        setModes,
        currentModeId,
        switchMode,
        settings,
        setSettings,
        devModeVisible,
        setDevModeVisible,
        processes,
        toggleProcessState
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

