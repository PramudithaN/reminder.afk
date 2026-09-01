import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Use contextBridge
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.ipcRenderer?.on('main-process-message', (_event: any, message: any) => {
  console.log(message)
})
