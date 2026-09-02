import robotUrl from '../assets/models/robot.glb'
import spidermanUrl from '../assets/models/spiderman.glb'
import bipedRobotUrl from '../assets/models/biped_robot.glb'
import mechDroneUrl from '../assets/models/mech_drone.glb'
import dragonWarriorUrl from '../assets/models/dragon_warrior.glb'

export interface Model {
  id: string
  name: string
  url: string
}

export const MODELS: Model[] = [
  { id: 'robot.glb', name: 'Robot', url: robotUrl },
  { id: 'spiderman.glb', name: 'Spider-Man', url: spidermanUrl },
  { id: 'biped_robot.glb', name: 'Biped Robot', url: bipedRobotUrl },
  { id: 'mech_drone.glb', name: 'Mech Drone', url: mechDroneUrl },
  { id: 'dragon_warrior.glb', name: 'Dragon Warrior', url: dragonWarriorUrl },
]

export function getModelUrl(modelId: string): string {
  const model = MODELS.find(m => m.id === modelId)
  return model ? model.url : robotUrl
}

