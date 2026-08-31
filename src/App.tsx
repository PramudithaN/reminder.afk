import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, useAnimations, Float, ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
)

function SettingsPanel({
  eyeInterval,
  setEyeInterval,
  stretchInterval,
  setStretchInterval,
  onClose
}: {
  eyeInterval: number,
  setEyeInterval: (v: number) => void,
  stretchInterval: number,
  setStretchInterval: (v: number) => void,
  onClose: () => void
}) {
  return (
    <div style={{
      background: 'white',
      padding: '24px 32px',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: 'system-ui, sans-serif',
      minWidth: '320px',
      pointerEvents: 'auto'
    }}>
      <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#1f2937', fontWeight: 700 }}>Preferences</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '1rem', color: '#374151', fontWeight: 600 }}>
          Eye Rest Interval (minutes)
        </label>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.4 }}>Recommended: 20 mins (20-20-20 rule to reduce eye strain)</p>
        <input 
          type="number" 
          value={eyeInterval}
          onChange={(e) => setEyeInterval(Number(e.target.value))}
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '1rem', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '1rem', color: '#374151', fontWeight: 600 }}>
          Stretch/Walk Interval (minutes)
        </label>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.4 }}>Recommended: 60 mins (Take a 5-minute break)</p>
        <input 
          type="number" 
          value={stretchInterval}
          onChange={(e) => setStretchInterval(Number(e.target.value))}
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #d1d5db', fontSize: '1rem', outline: 'none' }}
        />
      </div>

      <button 
        onClick={onClose}
        style={{
          marginTop: '12px',
          padding: '12px 20px',
          background: '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s',
          boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)'
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#4338ca')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#4f46e5')}
      >
        Save & Close
      </button>
    </div>
  )
}

function CharacterModel({ 
  activeBreak, 
  onDismiss,
  onOpenSettings
}: { 
  activeBreak: 'eye' | 'stretch', 
  onDismiss: () => void,
  onOpenSettings: () => void
}) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/robot.glb')
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const actionNames = Object.keys(actions)
    if (actionNames.length > 0 && actions[actionNames[0]]) {
      actions[actionNames[0]]?.play()
    }
  }, [actions])

  const title = activeBreak === 'eye' ? 'Time for an eye break!' : 'Time to stretch and walk!'
  const description = activeBreak === 'eye' 
    ? 'Look at something 20 feet away for 20 seconds. (20-20-20 Rule)' 
    : 'Stand up, take a small walk, and stretch your legs for 5 minutes.'

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <group ref={group} position={[0, -1.5, 0]} scale={1.5}>
        <primitive object={scene} />
      </group>
      
      {/* HTML Speech Bubble */}
      {/* Moved further left and higher so it doesn't cover the robot */}
      <Html position={[-3.5, 2.5, 0]} center>
        <div style={{
          background: 'white',
          padding: '24px 28px',
          borderRadius: '20px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          fontFamily: 'system-ui, sans-serif',
          minWidth: '260px',
          maxWidth: '320px',
          pointerEvents: 'auto',
          position: 'relative'
        }}>
          {/* Settings Gear Icon */}
          <button
            onClick={onOpenSettings}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: '#f3f4f6',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
              e.currentTarget.style.color = '#374151';
              e.currentTarget.style.transform = 'rotate(30deg)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
            title="Settings"
          >
            <SettingsIcon />
          </button>

          {/* Speech Bubble Arrow pointing towards the robot on the right */}
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '-12px',
            marginTop: '-12px',
            width: '24px',
            height: '24px',
            background: 'white',
            transform: 'rotate(45deg)',
            boxShadow: '4px -4px 10px rgba(0,0,0,0.05)',
            zIndex: -1
          }} />
          
          <h2 style={{ margin: '8px 0 0 0', fontSize: '1.4rem', color: '#111827', fontWeight: 700, textAlign: 'center', paddingRight: '20px' }}>
            {title}
          </h2>
          <p style={{ margin: 0, fontSize: '1rem', color: '#4b5563', textAlign: 'center', lineHeight: 1.5 }}>
            {description}
          </p>
          <button 
            onClick={onDismiss}
            style={{
              marginTop: '12px',
              padding: '12px 24px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.05rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '100%',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#4338ca';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#4f46e5';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            I took a break!
          </button>
        </div>
      </Html>
    </Float>
  )
}

function App() {
  const [activeBreak, setActiveBreak] = useState<'eye' | 'stretch' | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [settingsActiveOnly, setSettingsActiveOnly] = useState(false) // For standalone settings when no break is active

  const [eyeInterval, setEyeInterval] = useState(() => Number(localStorage.getItem('eyeInterval')) || 20)
  const [stretchInterval, setStretchInterval] = useState(() => Number(localStorage.getItem('stretchInterval')) || 60)

  useEffect(() => {
    localStorage.setItem('eyeInterval', eyeInterval.toString())
  }, [eyeInterval])

  useEffect(() => {
    localStorage.setItem('stretchInterval', stretchInterval.toString())
  }, [stretchInterval])

  const isVisible = activeBreak !== null || showSettings || settingsActiveOnly

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

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', pointerEvents: 'none' }}>
      {showSettings ? (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
          <SettingsPanel 
            eyeInterval={eyeInterval}
            setEyeInterval={setEyeInterval}
            stretchInterval={stretchInterval}
            setStretchInterval={setStretchInterval}
            onClose={() => {
              setShowSettings(false)
              setSettingsActiveOnly(false)
            }}
          />
        </div>
      ) : (
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          
          {/* Positioned the group slightly to the right to make room for bubble on the left */}
          <group position={[6, -4, 0]}>
            {activeBreak && (
              <CharacterModel 
                activeBreak={activeBreak}
                onDismiss={() => setActiveBreak(null)} 
                onOpenSettings={() => setShowSettings(true)}
              />
            )}
            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} />
          </group>
        </Canvas>
      )}
    </div>
  )
}

export default App
