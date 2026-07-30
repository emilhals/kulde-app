import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket-lite'
import { useSnapshot } from 'valtio'
import { controllerState, initialControllerState } from '../stores/controller'
import { flattenParams } from '../stores/controller.actions'
import {
  setCompressor,
  setCondensor,
  setEvaporator,
  setRoomTemp,
  setSimulationStatus,
  setSystemState,
} from '../stores/simulation.actions'
import { parseSimulationData } from '../utils/parseSimulationData'
import { RunState, PowerState } from '../constants/enums'

type ConnectionStatus = 'active' | 'connecting' | 'disconnected'

export const useSimulationSocket = () => {
  const controllerSnap = useSnapshot(controllerState)

  const url = import.meta.env.VITE_WS_URL
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected')

  const { sendMessage, readyState } = useWebSocket({
    url: url,
    onClose() {
      setSimulationStatus('idle')
      setConnectionStatus('disconnected')
    },
    onMessage(event) {
      const data = JSON.parse(event.data)

      if (data.status === 'STOPPED') {
        setSimulationStatus('idle')
        return
      }

      if (data.status === 'RUNNING') {
        setSimulationStatus('running')
      }

      const parsed = parseSimulationData(data)
      console.log('server:', data.Room)

      console.log('parsed:', parsed?.compressor.discharge_pressure)
      if (parsed === null || parsed === undefined) return

      setRoomTemp(parsed.roomTemp)

      setCompressor(parsed.compressor)
      setEvaporator(parsed.evaporator)
      setCondensor(parsed.condensor)
      setSystemState(
        parsed.compressor.run_state.value === RunState.RUNNING,
        parsed.compressor.power_state.value === PowerState.ON,
      )
    },
  })

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      setConnectionStatus('active')
    }
    if (readyState === ReadyState.CONNECTING) {
      setConnectionStatus('connecting')
    }
  }, [readyState])

  const startSimulation = () => {
    if (readyState !== ReadyState.OPEN) return

    sendMessage(
      JSON.stringify({
        command: 'START',
        controllerParams: flattenParams(controllerSnap),
      }),
    )
  }

  const restartSimulation = () => {
    if (readyState !== ReadyState.OPEN) return
    sendMessage(
      JSON.stringify({
        command: 'RESTART',
        controllerParams: initialControllerState,
      }),
    )
  }

  const stopSimulation = () => {
    if (readyState !== ReadyState.OPEN) return
    sendMessage(JSON.stringify({ command: 'STOP' }))
  }

  return {
    connectionStatus,
    startSimulation,
    restartSimulation,
    stopSimulation,
  }
}
