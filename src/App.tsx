import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, useAnimations, Float, ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
)

const MODELS = [
  { id: 'robot.glb', name: 'Robot' },
  { id: 'spiderman.glb', name: 'Spider-Man' },
  { id: 'venom.glb', name: 'Venom' },
]

function SettingsPanel({
  eyeInterval,
  setEyeInterval,
  stretchInterval,
  setStretchInterval,
  selectedModel,
  setSelectedModel,
  onClose
}: {
  eyeInterval: number,
  setEyeInterval: (v: number) => void,
  stretchInterval: number,
  setStretchInterval: (v: number) => void,
  selectedModel: string,
  setSelectedModel: (v: string) => void,
  onClose: () => void
}) {
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid #c4c4c4',
    fontSize: '1rem',
    color: '#1f2937',
    background: '#ffffff',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    position: 'absolute' as const,
    top: '-8px',
    left: '12px',
    background: '#ffffff',
    padding: '0 4px',
    fontSize: '0.75rem',
    color: '#3b82f6',
    fontWeight: 500,
    letterSpacing: '0.5px'
  }

  return (
    <div style={{
      background: '#ffffff',
      padding: '32px',
      borderRadius: '8px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px',
      fontFamily: '"Roboto", "Segoe UI", sans-serif',
      minWidth: '380px',
      pointerEvents: 'auto'
    }}>
      <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#111827', fontWeight: 500 }}>System Configuration</h2>
      
      <div style={{ position: 'relative', marginTop: '8px' }}>
        <label style={labelStyle}>RENDER ENTITY</label>
        <select 
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{...inputStyle, cursor: 'pointer', appearance: 'none'}}
        >
          {MODELS.map(m => (
            <option key={m.id} value={m.id} style={{ color: '#1f2937' }}>{m.name}</option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6b7280' }}>
          ▼
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <label style={labelStyle}>OPTICAL REST INTERVAL (MIN)</label>
        <input 
          type="number" 
          value={eyeInterval}
          onChange={(e) => setEyeInterval(Number(e.target.value))}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#c4c4c4'}
        />
        <p style={{ margin: '6px 0 0 4px', fontSize: '0.75rem', color: '#6b7280' }}>Recommended: 20 (20-20-20 protocol)</p>
      </div>

      <div style={{ position: 'relative' }}>
        <label style={labelStyle}>MOBILITY INTERVAL (MIN)</label>
        <input 
          type="number" 
          value={stretchInterval}
          onChange={(e) => setStretchInterval(Number(e.target.value))}
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#c4c4c4'}
        />
        <p style={{ margin: '6px 0 0 4px', fontSize: '0.75rem', color: '#6b7280' }}>Recommended: 60</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button 
          onClick={onClose}
          style={{
            padding: '10px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.95rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s',
            boxShadow: '0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#2563eb';
            e.currentTarget.style.boxShadow = '0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#3b82f6';
            e.currentTarget.style.boxShadow = '0 3px 1px -2px rgba(0,0,0,0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12)';
          }}
        >
          SAVE & DEPLOY
        </button>
      </div>
    </div>
  )
}

function CharacterModel({ 
  activeBreak,
  selectedModelFile,
  onDismiss,
  onOpenSettings
}: { 
  activeBreak: 'eye' | 'stretch',
  selectedModelFile: string,
  onDismiss: () => void,
  onOpenSettings: () => void
}) {
  const group = useRef<THREE.Group>(null)
  const modelWrapper = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(`/${selectedModelFile}`)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const actionNames = Object.keys(actions)
    if (actionNames.length > 0 && actions[actionNames[0]]) {
      actions[actionNames[0]]?.play()
    }
  }, [actions, selectedModelFile])

  // Dynamically scale and position the model so it always fits nicely
  useEffect(() => {
    if (modelWrapper.current && scene) {
      if (selectedModelFile === 'robot.glb') {
        // The robot's original hardcoded scale and position was perfect
        modelWrapper.current.scale.set(1.5, 1.5, 1.5)
        modelWrapper.current.position.set(0, -1.5, 0)
        return
      }

      // For other models (Spiderman, Venom), automatically normalize their size
      // to match the visual height of the robot (which is roughly 4.5 units tall)
      const box = new THREE.Box3().setFromObject(scene)
      const size = new THREE.Vector3()
      box.getSize(size)
      
      const targetHeight = 4.5
      
      if (size.y > 0) {
        const scale = targetHeight / size.y
        modelWrapper.current.scale.setScalar(scale)
        
        // Use the exact same position as the robot
        modelWrapper.current.position.set(0, -1.5, 0)
      }
    }
  }, [scene, selectedModelFile])

  const isEye = activeBreak === 'eye'
  
  // Tech/Code themed messages
  const title = isEye ? 'Exception: Optical Fatigue Detected' : 'Kernel Panic: Prolonged Sedentary State'
  const description = isEye 
    ? 'Execute 20-20-20 protocol. Shift visual focus to an object 20ft away for 20 seconds to prevent buffer underrun in your visual cortex.' 
    : 'Initiate hardware stretch sequence. Step away from the workstation for 5 minutes to flush vascular cache.'

  const themeColor = isEye ? '#0ea5e9' : '#10b981' // tech blue or terminal green

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <group ref={group}>
        <group ref={modelWrapper}>
          <primitive object={scene} />
        </group>
      </group>
      
      {/* HTML Speech Bubble */}
      {/* Moved closer to the model but keeping enough space to prevent overlap */}
      <Html position={[-5.2, 2.5, 0]} center zIndexRange={[100, 0]}>
        <div style={{
          background: 'rgba(17, 24, 39, 0.95)', // dark code editor theme
          backdropFilter: 'blur(8px)',
          border: `1px solid ${themeColor}`,
          borderRadius: '8px',
          boxShadow: `0 0 20px ${themeColor}40`,
          pointerEvents: 'auto',
          color: '#e5e7eb',
          fontFamily: '"Fira Code", "Consolas", monospace',
          padding: '24px 32px',
          minWidth: '340px',
          maxWidth: '420px',
          position: 'relative'
        }}>
          {/* Top Bar for Code Theme */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '24px', background: 'rgba(255,255,255,0.05)', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
             <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', marginRight: '6px' }} />
             <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308', marginRight: '6px' }} />
             <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
             <span style={{ marginLeft: '12px', fontSize: '0.7rem', color: '#9ca3af' }}>system_interrupt.sh</span>
          </div>

          <div style={{ marginTop: '16px' }}>
            {/* Settings Gear Icon */}
            <button
              onClick={onOpenSettings}
              style={{
                position: 'absolute',
                top: '36px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                padding: '4px',
                transition: 'color 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = themeColor }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#9ca3af' }}
              title="Configure System"
            >
              <SettingsIcon />
            </button>

            {/* Speech Bubble Arrow pointing right */}
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '-12px',
              marginTop: '-12px',
              width: '24px',
              height: '24px',
              background: 'rgba(17, 24, 39, 0.95)',
              borderRight: `1px solid ${themeColor}`,
              borderBottom: `1px solid ${themeColor}`,
              transform: 'rotate(-45deg)',
              zIndex: -1
            }} />
            
            <h2 style={{ 
              margin: '0', 
              fontSize: '1.2rem', 
              color: themeColor, 
              fontWeight: 600, 
              paddingRight: '30px',
              lineHeight: 1.4
            }}>
              {'>'} {title}
            </h2>
            <p style={{ 
              margin: '16px 0 0 0', 
              fontSize: '0.95rem', 
              color: '#d1d5db', 
              lineHeight: 1.6,
            }}>
              {description}
            </p>
            <button 
              onClick={onDismiss}
              style={{
                marginTop: '24px',
                padding: '10px 20px',
                background: 'transparent',
                color: themeColor,
                border: `1px solid ${themeColor}`,
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontFamily: '"Fira Code", "Consolas", monospace',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%',
                textTransform: 'uppercase'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = `${themeColor}20`; // 20 hex opacity
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              [ Acknowledge & Resume ]
            </button>
          </div>
        </div>
      </Html>
    </Float>
  )
}

function App() {
  const [activeBreak, setActiveBreak] = useState<'eye' | 'stretch' | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const [eyeInterval, setEyeInterval] = useState(() => Number(localStorage.getItem('eyeInterval')) || 20)
  const [stretchInterval, setStretchInterval] = useState(() => Number(localStorage.getItem('stretchInterval')) || 60)
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('selectedModel') || 'robot.glb')

  useEffect(() => {
    localStorage.setItem('eyeInterval', eyeInterval.toString())
  }, [eyeInterval])

  useEffect(() => {
    localStorage.setItem('stretchInterval', stretchInterval.toString())
  }, [stretchInterval])

  useEffect(() => {
    localStorage.setItem('selectedModel', selectedModel)
  }, [selectedModel])

  const isVisible = activeBreak !== null || showSettings

  useEffect(() => {
    const shouldIgnore = !isVisible;
    if (window.ipcRenderer) {
      window.ipcRenderer.send('set-ignore-mouse-events', shouldIgnore)
    }
  }, [isVisible])

  useEffect(() => {
    const eyeMs = eyeInterval * 60 * 1000;
    const stretchMs = stretchInterval * 60 * 1000;

    const triggerBreak = (type: 'eye' | 'stretch') => {
      if (window.ipcRenderer) {
        window.ipcRenderer.send('move-to-active-monitor')
      }
      setActiveBreak(type)
    }

    const eyeTimer = setInterval(() => {
      setActiveBreak(prev => {
        if (prev === 'stretch') return 'stretch';
        if (window.ipcRenderer) window.ipcRenderer.send('move-to-active-monitor');
        return 'eye';
      });
    }, eyeMs > 0 ? eyeMs : 20 * 60 * 1000)

    const stretchTimer = setInterval(() => {
      triggerBreak('stretch')
    }, stretchMs > 0 ? stretchMs : 60 * 60 * 1000)

    // Trigger initially for preview
    triggerBreak('eye')

    return () => {
      clearInterval(eyeTimer)
      clearInterval(stretchTimer)
    }
  }, [eyeInterval, stretchInterval])

  if (!isVisible) return null

  const dimmerStyle: React.CSSProperties = {
    width: '100vw', 
    height: '100vh', 
    position: 'relative', 
    pointerEvents: 'none',
    background: activeBreak ? 'rgba(0, 0, 0, 0.6)' : 'transparent', // Darker for better contrast with code popup
    backdropFilter: activeBreak ? 'blur(6px)' : 'none',
    transition: 'all 0.5s ease-in-out',
    zIndex: 9999
  }

  return (
    <div style={dimmerStyle}>
      {showSettings && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
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

// Preload the models
useGLTF.preload('/robot.glb')
useGLTF.preload('/spiderman.glb')
useGLTF.preload('/venom.glb')

export default App
