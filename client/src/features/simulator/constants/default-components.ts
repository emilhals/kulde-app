import { Compressor, Condensor, Evaporator } from '@/features/simulator/types'

export const DEFAULT_COMPRESSOR: Compressor = {
  power_state: { value: 'OFF', unit: 'none' },
  run_state: { value: 'IDLE', unit: 'none' },
  discharge_pressure: { value: 6, unit: 'pressure' },
  discharge_temp: { value: 24, unit: 'temperature' },
  suction_pressure: { value: 6, unit: 'pressure' },
  suction_temperature: { value: 24, unit: 'temperature' },
}

export const DEFAULT_EVAPORATOR: Evaporator = {
  pressure: { value: 6, unit: 'pressure' },
  temperature: { value: 24, unit: 'temperature' },
  overheat: { value: 0, unit: 'kelvin' },
  fan_speed: { value: 0, unit: 'percentage' },
}

export const DEFAULT_CONDENSOR: Condensor = {
  pressure: { value: 10, unit: 'pressure' },
  temperature: { value: 24, unit: 'temperature' },
  liquid_temp: { value: 24, unit: 'temperature' },
  subcooling: { value: 0, unit: 'kelvin' },
  fan_speed: { value: 0, unit: 'percentage' },
}
