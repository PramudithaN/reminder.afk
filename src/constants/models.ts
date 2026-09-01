import robotUrl from '../assets/models/robot.glb'
import spidermanUrl from '../assets/models/spiderman.glb'
import venomUrl from '../assets/models/venom.glb'

export interface Model {
  id: string
  name: string
  url: string
}

export const MODELS: Model[] = [
  { id: 'robot.glb', name: 'Robot', url: robotUrl },
  { id: 'spiderman.glb', name: 'Spider-Man', url: spidermanUrl },
  { id: 'venom.glb', name: 'Venom', url: venomUrl },
]

export function getModelUrl(modelId: string): string {
  const model = MODELS.find(m => m.id === modelId)
  return model ? model.url : robotUrl
}
