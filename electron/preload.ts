import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose safe IPC API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  // Renderer → Main
  send(channel: string, ...args: unknown[]) {
    ipcRenderer.send(channel, ...args)
  },
  invoke(channel: string, ...args: unknown[]): Promise<unknown> {
    return ipcRenderer.invoke(channel, ...args)
  },

  // Main → Renderer (subscribe)
  on(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) {
    ipcRenderer.on(channel, listener)
    // Return an unsubscribe function for easy cleanup in useEffect
    return () => ipcRenderer.off(channel, listener)
  },
  off(channel: string, listener: (...args: unknown[]) => void) {
    ipcRenderer.off(channel, listener)
  },
})
