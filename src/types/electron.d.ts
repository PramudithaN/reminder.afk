/**
 * Renderer-side type declarations for the Electron contextBridge API
 * exposed via electron/preload.ts.
 */
interface Window {
  ipcRenderer: {
    /** Send a message to the main process (fire and forget) */
    send(channel: string, ...args: unknown[]): void
    /** Send a message and await a reply from the main process */
    invoke(channel: string, ...args: unknown[]): Promise<unknown>
    /**
     * Subscribe to messages from the main process.
     * Returns an unsubscribe function for use in useEffect cleanup.
     */
    on(
      channel: string,
      listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
    ): () => void
    /** Unsubscribe a specific listener */
    off(channel: string, listener: (...args: unknown[]) => void): void
  }
}
