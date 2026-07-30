import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'
import {
  DEFAULT_COMPRESSOR,
  DEFAULT_CONDENSOR,
  DEFAULT_EVAPORATOR,
} from '../constants/default-components'
import { Compressor, Condensor, Evaporator } from '../types'

type Status = 'idle' | 'running' | 'stopping' | 'restarting'
type Speed = 'slow' | 'normal' | 'fast'

type Controls = { status: Status; speed: Speed }
type System = {
  roomTemp: number
  isCooling: boolean
  isDefrosting: boolean
  isFansRunning: boolean
}
export type Components = {
  compressor: Compressor
  evaporator: Evaporator
  condensor: Condensor
}

export type SimulationState = {
  controls: Controls
  system: System
  components: Components
}

export const isSpeed = (value: string): value is Speed => {
  return (value as Speed) !== undefined
}

export const initialSimulationState: SimulationState = {
  controls: { status: 'idle', speed: 'normal' },
  system: {
    roomTemp: 24.4,
    isCooling: false,
    isDefrosting: false,
    isFansRunning: false,
  },
  components: {
    compressor: DEFAULT_COMPRESSOR,
    evaporator: DEFAULT_EVAPORATOR,
    condensor: DEFAULT_CONDENSOR,
  },
}

export const simulationState = proxy(deepClone(initialSimulationState))
