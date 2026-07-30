import { Compressor, Condensor, Evaporator } from '@/features/simulator/types'

export const parseSimulationData = (data: any) => {
  return {
    roomTemp: data.Room.room_temp.toFixed(1),
    evaporator: {
      pressure: { value: data.Evaporator.suction_pressure, unit: 'pressure' },
      temperature: { value: data.Evaporator.suction_temp, unit: 'temperature' },
      overheat: { value: 0, unit: 'kelvin' },
      fan_speed: { value: data.Evaporator.fan_speed, unit: 'percentage' },
    } satisfies Evaporator,
    condensor: {
      pressure: { value: data.Condensor.condensing_pressure, unit: 'pressure' },
      temperature: {
        value: data.Condensor.condensing_temp,
        unit: 'temperature',
      },
      liquid_temp: { value: data.Condensor.liquid_temp, unit: 'temperature' },
      subcooling: { value: data.Condensor.subcooling, unit: 'kelvin' },
      fan_speed: { value: data.Condensor.fan_speed, unit: 'percentage' },
    } satisfies Condensor,
    compressor: {
      power_state: { value: data.Compressor.power_state, unit: 'none' },
      run_state: { value: data.Compressor.run_state, unit: 'none' },
      discharge_pressure: {
        value: data.Compressor.discharge_pressure,
        unit: 'pressure',
      },
      discharge_temp: {
        value: data.Compressor.discharge_temp,
        unit: 'temperature',
      },
      suction_pressure: {
        value: data.Evaporator.suction_pressure,
        unit: 'pressure',
      },
      suction_temperature: {
        value: data.Evaporator.suction_temp,
        unit: 'temperature',
      },
    } satisfies Compressor,
  }
}
