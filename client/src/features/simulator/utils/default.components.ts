import { Compressor, Condensator, Evaporator } from '@/features/simulator/types'

export const DEFAULT_COMPRESSOR: Compressor = {
  power_state: 'OFF',
  run_state: 'IDLE',
  discharge_pressure: 10,
  discharge_temp: 24,
  suction_pressure: 6,
  suction_temperature: 24,
}

export const DEFAULT_EVAPORATOR: Evaporator = {
  suction_pressure: 6,
  suction_temperature: 24,
  overheat: 0,
  fan_speed: 0,
}

export const DEFAULT_CONDENSATOR: Condensator = {
  condensing_pressure: 10,
  condensing_temperature: 24,
  liquid_temp: 24,
  subcooling: 0,
  fan_speed: 0,
}
