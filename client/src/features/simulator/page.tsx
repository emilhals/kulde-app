import { Compressor } from '@/features/simulator/canvas/Compressor'
import { HeatExchanger } from '@/features/simulator/canvas/HeatExchanger'
import { TEV } from '@/features/simulator/canvas/TEV'
import {
  controllerState,
  initialControllerState,
} from '@/features/simulator/store/models'
import type {
  Compressor as CompressorType,
  Condensator,
  Evaporator,
  SystemState,
} from '@/features/simulator/types'
import { Controller } from '@/features/simulator/ui/Controller'
import {
  DEFAULT_COMPRESSOR,
  DEFAULT_CONDENSATOR,
  DEFAULT_EVAPORATOR,
} from '@/features/simulator/utils/default.components'
import { useCustomFont } from '@/shared/hooks/useCustomFont'
import { useResponsiveStage } from '@/shared/hooks/useResponsiveStage'
import Konva from 'konva'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Layer, Stage } from 'react-konva'
import useWebSocket, { ReadyState } from 'react-use-websocket-lite'
import { subscribe, useSnapshot } from 'valtio'
import { PipeNetwork } from './canvas/PipeNetwork'
import { PressureGauge } from './canvas/PressureGauge'
import {
  compressorPosition,
  condenserPosition,
  evaporatorPosition,
  pipes,
  tevPosition,
} from './physics/positions'
import { flattenParams, resetControllerState } from './store/actions'
import { SimulationControls } from './ui/SimulationControls'
import { parseSimulationData } from './utils/parseSimulationData'

export const SimulatorPage = () => {
  const { t } = useTranslation()

  const [,] = useCustomFont('Inter')
  const url = import.meta.env.VITE_WS_URL

  const controllerSnap = useSnapshot(controllerState)

  const restartingRef = useRef<boolean>(false)

  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const stage = useResponsiveStage(containerRef)

  const [systemState, setSystemState] = useState<SystemState>({
    isCooling: false,
    isDefrosting: false,
    runningFans: false,
  })
  const [roomTemp, setRoomTemp] = useState<number>(24)

  const [compressor, setCompressor] =
    useState<CompressorType>(DEFAULT_COMPRESSOR)
  const [evaporator, setEvaporator] = useState<Evaporator>(DEFAULT_EVAPORATOR)
  const [condensator, setCondensator] =
    useState<Condensator>(DEFAULT_CONDENSATOR)

  const { sendMessage, readyState } = useWebSocket({
    url: url,
    onClose() {
      setSimulationStatus('IDLE')
    },
    onMessage(event) {
      if (restartingRef.current) return

      const data = JSON.parse(event.data)

      if (data.status === 'STOPPED') {
        setEvaporator({ ...evaporator, fan_speed: 0 })
        setCondensator({ ...condensator, fan_speed: 0 })
        restartingRef.current = false
        setSimulationStatus('IDLE')
        setSystemState({
          isCooling: false,
          isDefrosting: false,
          runningFans: false,
        })

        return
      }

      if (data.status === 'RUNNING') {
        setSimulationStatus('RUNNING')
      }

      const parsed = parseSimulationData(data)
      if (parsed === null || parsed === undefined) return

      setRoomTemp(parsed.roomTemp)
      setEvaporator(parsed.evaporator)
      setCondensator(parsed.condensator)
      setCompressor(parsed.compressor)

      if (compressor.run_state === 'RUNNING') {
        setSystemState({ ...systemState, isCooling: true })
      }
    },
  })

  const [simulationStatus, setSimulationStatus] = useState<
    'RUNNING' | 'STOPPING' | 'RESTARTING' | 'IDLE'
  >('IDLE')

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

  const handlePlay = () => {
    if (readyState !== ReadyState.OPEN) return

    sendMessage(
      JSON.stringify({
        command: 'START',
        controllerParams: flattenParams(controllerSnap),
      }),
    )

    setSimulationStatus('RUNNING')
  }

  const handleStop = () => {
    if (readyState !== ReadyState.OPEN) return

    sendMessage(JSON.stringify({ command: 'STOP' }))

    setSimulationStatus('STOPPING')
  }

  const handleRestart = () => {
    if (readyState !== ReadyState.OPEN) return

    resetControllerState()

    setRoomTemp(24)
    sendMessage(
      JSON.stringify({
        command: 'RESTART',
        controllerParams: initialControllerState,
      }),
    )

    setSimulationStatus('RESTARTING')
  }

  return (
    <div className="flex flex-col gap-2 py-2 px-2 w-full h-full min-h-0">
      <SimulationControls
        status={simulationStatus}
        onPlay={handlePlay}
        onRestart={handleRestart}
        onStop={handleStop}
      />

      <div className="flex justify-end py-2 px-4 h-32">
        <Controller roomTemp={roomTemp} systemState={systemState} />
      </div>

      <div
        ref={containerRef}
        className="overflow-hidden relative flex-1 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
      >
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
                  animate={simulationStatus === 'RUNNING'}
                  pressure={{ LP: 3, HP: 8 }}
                  pipes={pipes}
                />
              </Layer>
              <Layer>
                <Compressor position={compressorPosition} />
              </Layer>
            </Stage>
          )}
        </div>

        {readyState !== ReadyState.OPEN && (
          <div className="flex absolute inset-0 z-40 justify-center items-center bg-white/70">
            <div className="p-5 text-sm text-red-800 bg-red-50 rounded-md shadow">
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
