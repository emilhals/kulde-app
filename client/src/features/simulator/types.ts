export type Compressor = {
  power_state: string
  run_state: string
  discharge_pressure: number
  discharge_temp: number
}

export type Evaporator = {
  suction_pressure: number
  suction_temperature: number
}

export type Condensator = {
  condensing_pressure: number
  condensing_temperature: number
  liquid_temp: number
  subcooling: number
}
