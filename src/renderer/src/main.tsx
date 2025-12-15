// Semi UI 主题样式
import '@semi-bot/semi-theme-kaca-ac-mode-setter-semitheme/semi.min.css'
// 自定义样式
import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
