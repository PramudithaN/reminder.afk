import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useSettings } from './hooks/useSettings'
import { useBreakTimers } from './hooks/useBreakTimers'
import { SettingsPanel } from './components/SettingsPanel'
import { CharacterModel } from './components/CharacterModel'
import './App.css'

export default function App() {
  const { eyeInterval, setEyeInterval, stretchInterval, setStretchInterval, selectedModel, setSelectedModel } =
    useSettings()

  const { activeBreak, setActiveBreak } = useBreakTimers({ eyeInterval, stretchInterval })

  const [showSettings, setShowSettings] = useState(false)

  const isVisible = activeBreak !== null || showSettings

  // Toggle Electron mouse-event pass-through based on visibility
  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('set-ignore-mouse-events', !isVisible)
    }
  }, [isVisible])

  if (!isVisible) return null

  const dimmerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    pointerEvents: 'auto',
    background: activeBreak ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
    backdropFilter: activeBreak ? 'blur(6px)' : 'none',
    transition: 'all 0.5s ease-in-out',
    zIndex: 9999,
  }

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
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}

      {/* 3D Scene */}
      {!showSettings && (
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

          <group position={[6, -4, 0]}>
            {activeBreak && (
              <CharacterModel
                activeBreak={activeBreak}
                selectedModelFile={selectedModel}
                onDismiss={() => setActiveBreak(null)}
                onOpenSettings={() => setShowSettings(true)}
              />
            )}
            <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={15} blur={2.5} />
          </group>
        </Canvas>
      )}
    </div>
  )
}
