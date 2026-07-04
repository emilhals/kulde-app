import Konva from 'konva'

export type Position = Point
export type Vector = Point

export type Point = { x: number; y: number }

export type SimulationStatus = 'RUNNING' | 'STOPPING' | 'RESTARTING' | 'IDLE'

export type Pressure = { LP: number; HP: number }

export type ParticleNode = Konva.Circle & Particle

export type Particle = {
  id: string
  pipeId: string
  x: number
  y: number
  segmentIndex: number
  t: number
  direction: Point
  pressure: 'LP' | 'HP'
}

export type PipeSegment = {
  id: string
  start: Point
  end: Point
  radius: number
  flowDirection: Point
}

export type Pipe = {
  id: string
  from: Point
  to: Point
  points: Point[]
  pressure: 'LP' | 'HP'
  nextPipeId?: string
}

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
