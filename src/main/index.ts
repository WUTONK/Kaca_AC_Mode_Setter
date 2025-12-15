import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // 判断是否为开发环境
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

  // Create the browser window with frameless design for custom title bar
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    frame: false, // 无边框窗口，使用自定义顶栏
    titleBarStyle: 'hidden', // macOS 隐藏标题栏但保留交通灯按钮区域
    trafficLightPosition: { x: -100, y: -100 }, // macOS 隐藏交通灯
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (isDev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  app.setAppUserModelId('com.kaca.acmanager')

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Window control IPC handlers
  ipcMain.on('window-control', (_event, action: string) => {
    if (!mainWindow) return

    switch (action) {
      case 'minimize':
        mainWindow.minimize()
        break
      case 'maximize':
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize()
        } else {
          mainWindow.maximize()
        }
        break
      case 'close':
        mainWindow.close()
        break
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
