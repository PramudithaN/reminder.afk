/**
 * Renderer-side type declarations for the Electron contextBridge API
 * exposed via electron/preload.ts.
 */
interface Window {
  ipcRenderer: {
    on(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void): Electron.IpcRenderer
    off(channel: string, ...args: unknown[]): Electron.IpcRenderer
    send(channel: string, ...args: unknown[]): void
    invoke(channel: string, ...args: unknown[]): Promise<unknown>
  }
}
