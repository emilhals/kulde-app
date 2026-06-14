import Konva from 'konva'

export type Point = { x: number; y: number }

export type SimulationStatus = 'RUNNING' | 'STOPPING' | 'RESTARTING' | 'IDLE'

export type Particle = Konva.Circle & { velocity: Point; direction: number }

export type Compressor = {
  power_state: string
  run_state: string
  discharge_pressure: number
  discharge_temp: number
  suction_pressure: number
  suction_temperature: number
}

export type Evaporator = {
  suction_pressure: number
  suction_temperature: number
  overheat: number
  fan_speed: number
}

export type Condensator = {
  condensing_pressure: number
  condensing_temperature: number
  liquid_temp: number
  subcooling: number
  fan_speed: number
}

export type SystemState = {
  isCooling: boolean
  isDefrosting: boolean
  runningFans: boolean
}
