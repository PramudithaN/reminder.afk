import { type CSSProperties, Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import { useSettings } from './hooks/useSettings'
import { useBreakTimers } from './hooks/useBreakTimers'
import { getModelUrl } from './constants/models'
import { SettingsPanel } from './components/SettingsPanel'
import { CharacterModel } from './components/CharacterModel'
import './App.css'

export default function App() {
  const {
    eyeInterval, setEyeInterval,
    stretchInterval, setStretchInterval,
    selectedModel, setSelectedModel,
    isMuted, setIsMuted,
    launchAtStartup, setLaunchAtStartup,
  } = useSettings()

  const { activeBreak, setActiveBreak } = useBreakTimers({ eyeInterval, stretchInterval, isMuted })

  const [showSettings, setShowSettings] = useState(false)

  const isVisible = activeBreak !== null || showSettings

  // Toggle Electron mouse-event pass-through based on visibility
  useEffect(() => {
    window.ipcRenderer?.send('set-ignore-mouse-events', !isVisible)
  }, [isVisible])

  // ── Listen for IPC events sent from the tray / main process ──────────────
  useEffect(() => {
    if (!window.ipcRenderer) return

    // Tray → "Open Settings"
    const unsubOpen = window.ipcRenderer.on('open-settings', () => {
      setShowSettings(true)
    })

    // Tray → "Mute/Unmute Sounds" (tray-initiated toggle)
    const unsubMute = window.ipcRenderer.on('set-muted', (_e: Electron.IpcRendererEvent, muted: unknown) => {
      setIsMuted(muted as boolean)
    })

    return () => {
      unsubOpen()
      unsubMute()
    }
  }, [setIsMuted])

  if (!isVisible) return null

  const dimmerStyle: CSSProperties = {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    pointerEvents: 'auto',
    background: activeBreak ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
    backdropFilter: activeBreak ? 'blur(6px)' : 'none',
    WebkitBackdropFilter: activeBreak ? 'blur(6px)' : 'none',
    transition: 'all 0.4s ease-in-out',
    zIndex: 9999,
  }

  const currentModelUrl = getModelUrl(selectedModel)

  return (
    <div style={dimmerStyle}>
      {/* Settings Modal */}
      {showSettings && (
        <div
          className="modal-enter"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}
        >
          <SettingsPanel
            eyeInterval={eyeInterval}
            setEyeInterval={setEyeInterval}
            stretchInterval={stretchInterval}
            setStretchInterval={setStretchInterval}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            launchAtStartup={launchAtStartup}
            setLaunchAtStartup={setLaunchAtStartup}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}

      {/* 3D Scene */}
      {!showSettings && activeBreak && (
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <hemisphereLight intensity={0.6} groundColor="#333333" />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>

          <group position={[6, -4, 0]}>
            <CharacterModel
              activeBreak={activeBreak}
              selectedModelUrl={currentModelUrl}
              modelId={selectedModel}
              onDismiss={() => setActiveBreak(null)}
              onOpenSettings={() => setShowSettings(true)}
            />
            <Suspense fallback={null}>
              <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={15} blur={2.5} />
            </Suspense>
          </group>
        </Canvas>
      )}
    </div>
  )
}

