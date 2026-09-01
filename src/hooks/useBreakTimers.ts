import { useState, useEffect } from 'react'
import { playAlertSound } from '../lib/audio'

type BreakType = 'eye' | 'stretch'

interface UseBreakTimersOptions {
  eyeInterval: number
  stretchInterval: number
  isMuted: boolean
}

/**
 * Manages the break timer intervals and active break state.
 * Fires an eye break and a stretch break on their respective schedules.
 * Also triggers an immediate eye break on mount for preview purposes.
 */
export function useBreakTimers({ eyeInterval, stretchInterval, isMuted }: UseBreakTimersOptions) {
  const [activeBreak, setActiveBreak] = useState<BreakType | null>(null)

  useEffect(() => {
    const eyeMs = eyeInterval * 60 * 1000
    const stretchMs = stretchInterval * 60 * 1000

    const triggerBreak = (type: BreakType) => {
      if (window.ipcRenderer) {
        window.ipcRenderer.send('move-to-active-monitor')
      }
      if (!isMuted) playAlertSound()
      setActiveBreak(type)
    }

    const eyeTimer = setInterval(() => {
      // Don't override an active stretch break with an eye break
      setActiveBreak(prev => {
        if (prev === 'stretch') return 'stretch'
        if (window.ipcRenderer) window.ipcRenderer.send('move-to-active-monitor')
        if (!isMuted) playAlertSound()
        return 'eye'
      })
    }, eyeMs > 0 ? eyeMs : 20 * 60 * 1000)

    const stretchTimer = setInterval(() => {
      triggerBreak('stretch')
    }, stretchMs > 0 ? stretchMs : 60 * 60 * 1000)

    // Trigger immediately on mount for preview
    triggerBreak('eye')

    return () => {
      clearInterval(eyeTimer)
      clearInterval(stretchTimer)
    }
  }, [eyeInterval, stretchInterval, isMuted])

  return { activeBreak, setActiveBreak }
}
