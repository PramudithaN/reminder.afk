import { useState, useEffect } from 'react'

const STORAGE_KEYS = {
  eyeInterval: 'eyeInterval',
  stretchInterval: 'stretchInterval',
  selectedModel: 'selectedModel',
  isMuted: 'isMuted',
  launchAtStartup: 'launchAtStartup',
} as const

/**
 * Manages user settings state, persisting each value to localStorage.
 * Also syncs relevant settings to the Electron main process via IPC.
 */
export function useSettings() {
  const [eyeInterval, setEyeInterval] = useState<number>(
    () => Number(localStorage.getItem(STORAGE_KEYS.eyeInterval)) || 20
  )
  const [stretchInterval, setStretchInterval] = useState<number>(
    () => Number(localStorage.getItem(STORAGE_KEYS.stretchInterval)) || 60
  )
  const [selectedModel, setSelectedModel] = useState<string>(
    () => localStorage.getItem(STORAGE_KEYS.selectedModel) || 'robot.glb'
  )
  const [isMuted, setIsMuted] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEYS.isMuted) === 'true'
  )
  const [launchAtStartup, setLaunchAtStartup] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEYS.launchAtStartup) === 'true'
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.eyeInterval, eyeInterval.toString())
  }, [eyeInterval])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.stretchInterval, stretchInterval.toString())
  }, [stretchInterval])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.selectedModel, selectedModel)
  }, [selectedModel])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.isMuted, isMuted.toString())
    // Notify main process to sync tray menu label
    window.ipcRenderer?.send('mute-changed', isMuted)
  }, [isMuted])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.launchAtStartup, launchAtStartup.toString())
    // Tell Electron main process to register/unregister startup entry
    window.ipcRenderer?.send('set-launch-at-startup', launchAtStartup)
  }, [launchAtStartup])

  return {
    eyeInterval,
    setEyeInterval,
    stretchInterval,
    setStretchInterval,
    selectedModel,
    setSelectedModel,
    isMuted,
    setIsMuted,
    launchAtStartup,
    setLaunchAtStartup,
  }
}
