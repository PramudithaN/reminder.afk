import { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null = null
let tray: Tray | null = null

// Tracks mute state in main so tray menu label stays in sync
let trayMuted = false

// ─── Tray icon ───────────────────────────────────────────────────────────────
function getTrayIcon(isMuted: boolean): Electron.NativeImage {
  const iconName = isMuted ? 'mutedTrayIconAFK.png' : 'trayIconAFK.png'
  const iconPath = path.join(process.env.VITE_PUBLIC, iconName)
  const fromFile = nativeImage.createFromPath(iconPath)
  if (!fromFile.isEmpty()) return fromFile.resize({ width: 16, height: 16 })

  const fallbackPath = path.join(process.env.VITE_PUBLIC, 'tray-icon.png')
  const fromFallback = nativeImage.createFromPath(fallbackPath)
  if (!fromFallback.isEmpty()) return fromFallback.resize({ width: 16, height: 16 })

  // Fallback: a minimal 1×1 indigo PNG encoded as base64
  return nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAA' +
    'eklEQVQ4jWNgGAWDCjD8/8/AAAAASgCqAAAAAElFTkSuQmCC'
  )
}

function updateTray(): void {
  if (!tray) return
  tray.setImage(getTrayIcon(trayMuted))
  tray.setContextMenu(buildTrayMenu())
}

// ─── Tray context menu ────────────────────────────────────────────────────────
function buildTrayMenu(): Electron.Menu {
  return Menu.buildFromTemplate([
    {
      label: 'Open Settings',
      click: () => win?.webContents.send('open-settings'),
    },
    {
      label: trayMuted ? '🔔 Unmute Sounds' : '🔕 Mute Sounds',
      click: () => {
        trayMuted = !trayMuted
        win?.webContents.send('set-muted', trayMuted)
        updateTray()
      },
    },
    { type: 'separator' },
    {
      label: 'Quit reminder.afk',
      click: () => {
        app.quit()
      },
    },
  ])
}

// ─── Create system tray ───────────────────────────────────────────────────────
function createTray(): void {
  tray = new Tray(getTrayIcon(trayMuted))
  tray.setToolTip('reminder.afk | break reminder')
  tray.setContextMenu(buildTrayMenu())

  // Single-click on tray also opens settings (Windows behaviour)
  tray.on('click', () => {
    win?.webContents.send('open-settings')
  })
}

// ─── Browser window ───────────────────────────────────────────────────────────
function createWindow(): void {
  win = new BrowserWindow({
    title: '',
    titleBarStyle: 'hidden',
    icon: path.join(process.env.VITE_PUBLIC, 'trayIconAFK.png'),
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      autoplayPolicy: 'no-user-gesture-required',
    },
  })

  // Render above taskbars and fullscreen apps
  win.setAlwaysOnTop(true, 'screen-saver')
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  win.setIgnoreMouseEvents(true, { forward: true })

  // ── IPC handlers ────────────────────────────────────────────────────────────

  // Toggle pointer-events pass-through
  ipcMain.on('set-ignore-mouse-events', (_event, ignore: boolean) => {
    win?.setIgnoreMouseEvents(ignore, { forward: true })
  })

  // Move window to the monitor where the cursor currently is
  ipcMain.on('move-to-active-monitor', () => {
    if (!win) return
    const point = screen.getCursorScreenPoint()
    const display = screen.getDisplayNearestPoint(point)
    win.setBounds(display.bounds)
    win.setFullScreen(true)
  })

  // Sync mute state from renderer → keep tray menu label and icon up to date
  ipcMain.on('mute-changed', (_event, muted: boolean) => {
    trayMuted = muted
    updateTray()
  })

  // Launch at startup toggle from renderer
  ipcMain.on('set-launch-at-startup', (_event, enable: boolean) => {
    app.setLoginItemSettings({
      openAtLogin: enable,
      // On Windows, launch the app minimised (no flash on boot)
      args: process.platform === 'win32' ? ['--process-start-args', '"--hidden"'] : [],
    })
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// ─── Single Instance Lock & App lifecycle ─────────────────────────────────────

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  // Prevent the app from quitting when all windows are closed
  // (it lives in the tray instead)
  app.on('window-all-closed', (e: Event) => {
    e.preventDefault()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  app.whenReady().then(() => {
    createWindow()
    createTray()
  })
}
