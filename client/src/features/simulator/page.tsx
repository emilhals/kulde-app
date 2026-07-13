import { Compressor } from '@/features/simulator/canvas/Compressor'
import { HeatExchanger } from '@/features/simulator/canvas/HeatExchanger'
import { PipeNetwork } from '@/features/simulator/canvas/PipeNetwork'
import { PressureGauge } from '@/features/simulator/canvas/PressureGauge'
import { TEV } from '@/features/simulator/canvas/TEV'
import {
  compressorPosition,
  condenserPosition,
  evaporatorPosition,
  pipes,
  tevPosition,
} from '@/features/simulator/physics/positions'
import {
  flattenParams,
  resetControllerState,
} from '@/features/simulator/store/actions'
import {
  controllerState,
  initialControllerState,
} from '@/features/simulator/store/models'
import type {
  Compressor as CompressorType,
  Condensator,
  Evaporator,
  SimulationSpeed,
  SystemState,
} from '@/features/simulator/types'
import { Controller } from '@/features/simulator/ui/Controller'
import { Toolbar } from '@/features/simulator/ui/Toolbar'
import {
  DEFAULT_COMPRESSOR,
  DEFAULT_CONDENSATOR,
  DEFAULT_EVAPORATOR,
} from '@/features/simulator/utils/default.components'
import { parseSimulationData } from '@/features/simulator/utils/parseSimulationData'
import { useCustomFont } from '@/shared/hooks/useCustomFont'
import { useResponsiveStage } from '@/shared/hooks/useResponsiveStage'
import Konva from 'konva'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Layer, Stage, Text } from 'react-konva'
import useWebSocket, { ReadyState } from 'react-use-websocket-lite'
import { subscribe, useSnapshot } from 'valtio'
import { PowerState, RunState } from './utils/enums'

export const SimulatorPage = () => {
  const { t } = useTranslation()

  const [,] = useCustomFont('Inter')
  const url = import.meta.env.VITE_WS_URL

  const controllerSnap = useSnapshot(controllerState)

  const restartingRef = useRef<boolean>(false)

  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const stage = useResponsiveStage(containerRef)

  const [simulationSpeed, setSimulationSpeed] =
    useState<SimulationSpeed>('normal')
  const [systemState, setSystemState] = useState<SystemState>({
    isCooling: false,
    isDefrosting: false,
    runningFans: false,
  })
  const [roomTemp, setRoomTemp] = useState<string>('24.2')

  const [compressor, setCompressor] =
    useState<CompressorType>(DEFAULT_COMPRESSOR)
  const [evaporator, setEvaporator] = useState<Evaporator>(DEFAULT_EVAPORATOR)
  const [condensator, setCondensator] =
    useState<Condensator>(DEFAULT_CONDENSATOR)

  const { sendMessage, readyState } = useWebSocket({
    url: url,
    onClose() {
      setSimulationStatus('idle')
    },
    onMessage(event) {
      if (restartingRef.current) return

      const data = JSON.parse(event.data)

      if (data.status === 'STOPPED') {
        setEvaporator({ ...evaporator, fan_speed: 0 })
        setCondensator({ ...condensator, fan_speed: 0 })
        restartingRef.current = false
        setSimulationStatus('idle')
        setSystemState({
          isCooling: false,
          isDefrosting: false,
          runningFans: false,
        })

        return
      }

      if (data.status === 'running') {
        setSimulationStatus('running')
      }

      const parsed = parseSimulationData(data)
      if (parsed === null || parsed === undefined) return

      setRoomTemp(parsed.roomTemp)
      setEvaporator(parsed.evaporator)
      setCondensator(parsed.condensator)
      setCompressor(parsed.compressor)

      console.log(parsed.compressor)

      setSystemState((prev) => ({
        ...prev,
        isCooling: parsed.compressor.run_state === RunState.RUNNING,
        runningFans: parsed.compressor.power_state === PowerState.ON,
      }))
    },
  })

  const [simulationStatus, setSimulationStatus] = useState<
    'running' | 'stopping' | 'restarting' | 'idle'
  >('idle')

  useEffect(() => {
    const unsubscribe = subscribe(controllerState, () => {
      if (readyState !== ReadyState.OPEN) return
      sendMessage(
        JSON.stringify({
          command: 'UPDATE_PARAMS',
          controllerParams: flattenParams(controllerState),
        }),
      )
    })

    return () => unsubscribe()
  }, [readyState, sendMessage])

  const handleSpeedChange = (speed: SimulationSpeed) => {
    const speedNum = speed === 'normal' ? 10 : 30
    setSimulationSpeed(speed)

    sendMessage(JSON.stringify({ command: 'UPDATE_SPEED', speed: speedNum }))
  }

  const handleStart = () => {
    if (readyState !== ReadyState.OPEN) return

    sendMessage(
      JSON.stringify({
        command: 'START',
        controllerParams: flattenParams(controllerSnap),
      }),
    )

    setSimulationStatus('running')
  }

  const handleStop = () => {
    if (readyState !== ReadyState.OPEN) return

    sendMessage(JSON.stringify({ command: 'STOP' }))

    setSimulationStatus('stopping')
  }

  const handleRestart = () => {
    if (readyState !== ReadyState.OPEN) return

    resetControllerState()

    setRoomTemp('24.0')
    sendMessage(
      JSON.stringify({
        command: 'RESTART',
        controllerParams: initialControllerState,
      }),
    )

    setSimulationStatus('restarting')
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-2 px-2 py-2">
      <Toolbar
        status={simulationStatus}
        speed={simulationSpeed}
        onSpeedChange={handleSpeedChange}
        onStart={handleStart}
        onRestart={handleRestart}
        onStop={handleStop}
      />

      <div className="flex h-32 justify-end px-4 py-2">
        <Controller roomTemp={roomTemp} systemState={systemState} />
      </div>

      <div className="relative flex-1 overflow-hidden rounded-lg border border-gray-300 bg-gray-100 focus:outline-none">
        <div ref={containerRef} className="h-full bg-slate-100">
          {stage && (
            <Stage width={stage.width} height={stage.height} ref={stageRef}>
              <Layer>
                <HeatExchanger
                  label="Condensor"
                  data={condensator}
                  position={condenserPosition}
                />

                <HeatExchanger
                  label="Evaporator"
                  data={condensator}
                  position={evaporatorPosition}
                />
                <TEV position={tevPosition} />

                <PressureGauge
                  type="HP"
                  inlet={{ x: 400, y: 400 }}
                  pressure={compressor.discharge_pressure}
                />
                <PressureGauge
                  type="LP"
                  inlet={{ x: 900, y: 420 }}
                  pressure={compressor.suction_pressure}
                />
              </Layer>

              <Layer>
                <PipeNetwork
                  animate={simulationStatus === 'running'}
                  pressure={{ LP: 3, HP: 8 }}
                  pipes={pipes}
                />
              </Layer>
              <Layer>
                <Text
                  text={compressor.run_state}
                  y={500}
                  x={550}
                  fontStyle="bold"
                  align="center"
                />

                <Text
                  text={compressor.power_state}
                  y={520}
                  x={550}
                  fontStyle="bold"
                  align="center"
                />
                <Compressor position={compressorPosition} />
              </Layer>
            </Stage>
          )}
        </div>

        {readyState !== ReadyState.OPEN && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/70">
            <div className="rounded-md bg-red-50 p-5 text-sm text-red-800 shadow">
              {readyState === ReadyState.CONNECTING
                ? 'Connecting to simulation server...'
                : t('simulator.no-connection')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
