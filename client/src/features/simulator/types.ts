import Konva from 'konva'

export type Position = Omit<Point, 'id'>
export type Vector = Point
export type Direction = 'left' | 'right' | 'up' | 'down'

export type Point = { id?: string; x: number; y: number }

export type SimulationStatus = 'running' | 'stopping' | 'restarting' | 'idle'
export type SimulationSpeed = 'slow' | 'normal' | 'fast'

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

export type Unit = 'pressure' | 'temperature' | 'percentage' | 'kelvin' | 'none'
type ComponentData = { value: string | number; unit: Unit }

export type Compressor = {
  power_state: ComponentData
  run_state: ComponentData
  discharge_pressure: ComponentData
  discharge_temp: ComponentData
  suction_pressure: ComponentData
  suction_temperature: ComponentData
}

export type Evaporator = {
  pressure: ComponentData
  temperature: ComponentData
  overheat: ComponentData
  fan_speed: ComponentData
}

export type Condensor = {
  pressure: ComponentData
  temperature: ComponentData
  liquid_temp: ComponentData
  subcooling: ComponentData
  fan_speed: ComponentData
}
