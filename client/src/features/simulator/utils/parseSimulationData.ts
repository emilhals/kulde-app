import { Compressor, Condensator, Evaporator } from '@/features/simulator/types'

export const parseSimulationData = (data: any) => {
  const fanSpeed = data.Room.room_temp < 10 ? 60 : 100

  return {
    roomTemp: data.Room.room_temp as number,
    evaporator: {
      suction_pressure: data.Evaporator.suction_pressure,
      suction_temperature: data.Evaporator.suction_temp,
      overheat: 0,
      fan_speed: fanSpeed,
    } satisfies Evaporator,
    condensator: {
      condensing_pressure: data.Condensator.condensing_pressure,
      condensing_temperature: data.Condensator.condensing_temp,
      liquid_temp: data.Condensator.liquid_temp,
      subcooling: data.Condensator.subcooling,
      fan_speed: 100,
    } satisfies Condensator,
    compressor: {
      power_state: data.Compressor.power_state,
      run_state: data.Compressor.run_state,
      discharge_pressure: data.Compressor.discharge_pressure,
      discharge_temp: data.Compressor.discharge_temp,
      suction_pressure: data.Evaporator.suction_pressure,
      suction_temperature: data.Evaporator.suction_temp,
    } satisfies Compressor,
  }
}
