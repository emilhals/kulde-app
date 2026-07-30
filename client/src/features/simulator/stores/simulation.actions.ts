import { deepClone } from 'valtio/utils'
import {
  Compressor,
  Condensor,
  Evaporator,
  SimulationSpeed,
  SimulationStatus,
} from '../types'
import { initialSimulationState, simulationState } from './simulation'

export const setRoomTemp = (temperature: number) => {
  simulationState.system.roomTemp = temperature
}

export const setSystemState = (isCooling: boolean, isFansRunning: boolean) => {
  simulationState.system.isCooling = isCooling
  simulationState.system.isFansRunning = isFansRunning
}

export const setSimulationStatus = (status: SimulationStatus) => {
  simulationState.controls.status = status
}

export const setSimulationSpeed = (speed: SimulationSpeed) => {
  simulationState.controls.speed = speed
}

export const setCompressor = (compressor: Compressor) => {
  simulationState.components.compressor = compressor
}

export const setCondensor = (condensor: Condensor) => {
  simulationState.components.condensor = condensor
}

export const setEvaporator = (evaporator: Evaporator) => {
  simulationState.components.evaporator = evaporator
}

export const stopSimulationState = () => {
  simulationState.system.isCooling = false
  simulationState.system.isDefrosting = false
  simulationState.system.isFansRunning = false
}

export const resetSimulation = () => {
  const resetObj = deepClone(initialSimulationState)

  Object.keys(resetObj).forEach((key) => {
    ;(simulationState as any)[key] = (resetObj as any)[key]
  })
}
