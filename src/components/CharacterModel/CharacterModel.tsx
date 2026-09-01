import { useEffect, useRef } from 'react'
import { Float, Html, PresentationControls, useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SettingsIcon } from '../icons/SettingsIcon'

type BreakType = 'eye' | 'stretch'

const BREAK_CONTENT: Record<BreakType, { title: string; description: string; color: string }> = {
  eye: {
    title: 'Exception: Optical Fatigue Detected',
    description:
      'Execute 20-20-20 protocol. Shift visual focus to an object 20ft away for 20 seconds to prevent buffer underrun in your visual cortex.',
    color: '#0ea5e9',
  },
  stretch: {
    title: 'Kernel Panic: Prolonged Sedentary State',
    description:
      'Initiate hardware stretch sequence. Step away from the workstation for 5 minutes to flush vascular cache.',
    color: '#10b981',
  },
}

interface CharacterModelProps {
  activeBreak: BreakType
  selectedModelFile: string
  onDismiss: () => void
  onOpenSettings: () => void
}

export function CharacterModel({ activeBreak, selectedModelFile, onDismiss, onOpenSettings }: CharacterModelProps) {
  const group = useRef<THREE.Group>(null)
  const modelWrapper = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(`/${selectedModelFile}`)
  const { actions } = useAnimations(animations, group)

  // Play the first available animation
  useEffect(() => {
    const actionNames = Object.keys(actions)
    if (actionNames.length > 0 && actions[actionNames[0]]) {
      actions[actionNames[0]]?.play()
    }
  }, [actions, selectedModelFile])

  // Normalize model size to a consistent visual height
  useEffect(() => {
    if (!modelWrapper.current || !scene) return

    if (selectedModelFile === 'robot.glb') {
      // Robot's hardcoded scale is already perfect
      modelWrapper.current.scale.set(1.5, 1.5, 1.5)
      modelWrapper.current.position.set(0, -1.5, 0)
      return
    }

    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)

    const targetHeight = 4.5
    if (size.y > 0) {
      modelWrapper.current.scale.setScalar(targetHeight / size.y)
      modelWrapper.current.position.set(0, -1.5, 0)
    }
  }, [scene, selectedModelFile])

  const { title, description, color } = BREAK_CONTENT[activeBreak]

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <PresentationControls
        global
        cursor
        snap={false}
        speed={3.5}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Infinity, Infinity]}
      >
        <group ref={group}>
          <group ref={modelWrapper}>
            <primitive object={scene} />
          </group>
        </group>
      </PresentationControls>

      {/* HTML Speech Bubble */}
      <Html position={[-5.2, 2.5, 0]} center zIndexRange={[100, 0]}>
        <div
          style={{
            background: 'rgba(16, 16, 16, 0.96)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            pointerEvents: 'auto',
            color: '#f3f4f6',
            fontFamily: '"Fira Code", "Consolas", monospace',
            padding: '24px 32px',
            minWidth: '340px',
            maxWidth: '420px',
            position: 'relative',
          }}
        >
          {/* macOS-style title bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '24px',
              background: 'rgba(255,255,255,0.05)',
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
            }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', marginRight: '6px' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308', marginRight: '6px' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ marginLeft: '12px', fontSize: '0.7rem', color: '#9ca3af' }}>system_interrupt.sh</span>
          </div>

          <div style={{ marginTop: '16px' }}>
            {/* Settings button */}
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
              onMouseOver={(e) => { e.currentTarget.style.color = color }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#9ca3af' }}
              title="Configure System"
            >
              <SettingsIcon />
            </button>

            {/* Speech bubble arrow */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '-12px',
                marginTop: '-12px',
                width: '24px',
                height: '24px',
                background: 'rgba(16, 16, 16, 0.96)',
                borderRight: `1px solid ${color}`,
                borderBottom: `1px solid ${color}`,
                transform: 'rotate(-45deg)',
                zIndex: -1,
              }}
            />

            <h2
              style={{
                margin: '0',
                fontSize: '1.2rem',
                color: color,
                fontWeight: 600,
                paddingRight: '30px',
                lineHeight: 1.4,
              }}
            >
              {'>'} {title}
            </h2>

            <p style={{ margin: '16px 0 0 0', fontSize: '0.95rem', color: '#d1d5db', lineHeight: 1.6 }}>
              {description}
            </p>

            <button
              onClick={onDismiss}
              style={{
                marginTop: '24px',
                padding: '10px 20px',
                background: 'transparent',
                color: color,
                border: `1px solid ${color}`,
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontFamily: '"Fira Code", "Consolas", monospace',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%',
                textTransform: 'uppercase',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = `${color}20` }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              [ Acknowledge & Resume ]
            </button>
          </div>
        </div>
      </Html>
    </Float>
  )
}

// Preload all models at module level so they're ready when needed
useGLTF.preload('/robot.glb')
useGLTF.preload('/spiderman.glb')
useGLTF.preload('/venom.glb')
