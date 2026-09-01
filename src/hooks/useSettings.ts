import { useState, useEffect } from 'react'

const STORAGE_KEYS = {
  eyeInterval: 'eyeInterval',
  stretchInterval: 'stretchInterval',
  selectedModel: 'selectedModel',
} as const

/**
 * Manages user settings state, persisting each value to localStorage.
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.eyeInterval, eyeInterval.toString())
  }, [eyeInterval])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.stretchInterval, stretchInterval.toString())
  }, [stretchInterval])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.selectedModel, selectedModel)
  }, [selectedModel])

  return {
    eyeInterval,
    setEyeInterval,
    stretchInterval,
    setStretchInterval,
    selectedModel,
    setSelectedModel,
  }
}
