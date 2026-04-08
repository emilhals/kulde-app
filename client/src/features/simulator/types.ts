export type CompressorType = {
    power_state: string
    run_state: string
    discharge_pressure: number
    discharge_temp: number
    suction_pressure: number
    suction_temperature: number
}

export type EvaporatorType = {
    suction_pressure: number
    suction_temperature: number
    overheat: number
    fan_speed: number
}

export type CondensatorType = {
    condensing_pressure: number
    condensing_temperature: number
    liquid_temp: number
    subcooling: number
    fan_speed: number
}

export type PositionType = {
    x: number
    y: number
}
