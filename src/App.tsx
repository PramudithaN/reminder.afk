import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, Float, ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

function CharacterModel({ onDismiss }: { onDismiss: () => void }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/robot.glb')
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const actionNames = Object.keys(actions)
    if (actionNames.length > 0 && actions[actionNames[0]]) {
      actions[actionNames[0]]?.play()
    }
  }, [actions])

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <group ref={group} position={[0, -1.5, 0]} scale={1.5}>
        <primitive object={scene} />
      </group>
      
      {/* HTML Speech Bubble */}
      <Html position={[2, 2.5, 0]} center>
        <div style={{
          background: 'white',
          padding: '16px 24px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'system-ui, sans-serif',
          minWidth: '200px',
          pointerEvents: 'auto'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '20px',
            width: '20px',
            height: '20px',
            background: 'white',
            transform: 'rotate(45deg)',
            boxShadow: '4px 4px 10px rgba(0,0,0,0.1)',
            zIndex: -1
          }} />
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1f2937', fontWeight: 600 }}>
            Time to take a break!
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#4b5563', textAlign: 'center' }}>
            Look away from the screen, stretch, and grab some water.
          </p>
          <button 
            onClick={onDismiss}
            style={{
              marginTop: '8px',
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#2563eb')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#3b82f6')}
          >
            I took a break!
          </button>
        </div>
      </Html>
    </Float>
  )
}

function App() {
  const [isVisible, setIsVisible] = useState(false)

  // Sync mouse ignore state with visibility
  useEffect(() => {
    // If visible, we DO NOT ignore mouse events (we want to click the button)
    // If hidden, we DO ignore mouse events (pass clicks through to desktop)
    const shouldIgnore = !isVisible;
    if (window.ipcRenderer) {
      window.ipcRenderer.send('set-ignore-mouse-events', shouldIgnore)
    }
  }, [isVisible])

  useEffect(() => {
    const INTERVAL_MS = 20 * 60 * 1000 
    const showTimer = setInterval(() => {
      setIsVisible(true)
    }, INTERVAL_MS)

    // For testing: trigger immediately
    setIsVisible(true)

    return () => clearInterval(showTimer)
  }, [])

  if (!isVisible) return null

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        <group position={[6, -4, 0]}>
          <CharacterModel onDismiss={() => setIsVisible(false)} />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} />
        </group>
      </Canvas>
    </div>
  )
}

export default App
