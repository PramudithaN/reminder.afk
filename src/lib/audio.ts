/**
 * Plays a two-tone tech-style alert beep using the Web Audio API.
 */
export function playAlertSound(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()

    // First tech beep
    const osc1 = audioCtx.createOscillator()
    const gainNode1 = audioCtx.createGain()
    osc1.type = 'square'
    osc1.frequency.setValueAtTime(880, audioCtx.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1)

    gainNode1.gain.setValueAtTime(0, audioCtx.currentTime)
    gainNode1.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.02)
    gainNode1.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15)

    osc1.connect(gainNode1)
    gainNode1.connect(audioCtx.destination)
    osc1.start(audioCtx.currentTime)
    osc1.stop(audioCtx.currentTime + 0.15)

    // Second tech beep slightly later
    const osc2 = audioCtx.createOscillator()
    const gainNode2 = audioCtx.createGain()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(1046.5, audioCtx.currentTime + 0.1)
    osc2.frequency.exponentialRampToValueAtTime(523.25, audioCtx.currentTime + 0.2)

    gainNode2.gain.setValueAtTime(0, audioCtx.currentTime + 0.1)
    gainNode2.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.12)
    gainNode2.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.25)

    osc2.connect(gainNode2)
    gainNode2.connect(audioCtx.destination)
    osc2.start(audioCtx.currentTime + 0.1)
    osc2.stop(audioCtx.currentTime + 0.25)
  } catch (e) {
    console.warn('Audio playback failed', e)
  }
}
