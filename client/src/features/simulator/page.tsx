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
import Konva from 'konva'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Layer, Line, Stage } from 'react-konva'
import useWebSocket, { ReadyState } from 'react-use-websocket-lite'
import { subscribe, useSnapshot } from 'valtio'
import { flattenParams, resetControllerState } from './store/actions'
import { SimulationControls } from './ui/SimulationControls'
import {
  DEFAULT_COMPRESSOR,
  DEFAULT_CONDENSATOR,
  DEFAULT_EVAPORATOR,
} from './utils/default.components'
import { parseSimulationData } from './utils/parseSimulationData'

export const SimulatorPage = () => {
  const { t } = useTranslation()

  const url = import.meta.env.VITE_WS_URL

  const controllerSnap = useSnapshot(controllerState)

  const restartingRef = useRef<boolean>(false)

  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [stage, setStage] = useState({ width: 800, height: 600, scale: 1 })
  const DESIGN_WIDTH = 900
  const DESIGN_HEIGHT = 700

  useEffect(() => {
    if (!containerRef.current) return
    const resize = () => {
      const container = containerRef.current
      if (!container) return
      const { clientWidth, clientHeight } = containerRef.current

      const scaleX = clientWidth / DESIGN_WIDTH
      const scaleY = clientHeight / DESIGN_HEIGHT
      const scale = Math.min(scaleX, scaleY)
      console.count('resize observer fired')
      setStage((prev) => {
        if (
          prev.width === clientWidth &&
          prev.height === clientHeight &&
          prev.scale === scale
        ) {
          return prev
        }

        return { width: clientWidth, height: clientHeight, scale }
      })
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(containerRef.current)
    containerRef.current?.focus()
    return () => ro.disconnect()
  }, [])

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
      console.log(data)

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
    <div className="flex gap-2 py-2 px-2 w-full h-full min-h-0">
      <SimulationControls
        status={simulationStatus}
        onPlay={handlePlay}
        onRestart={handleRestart}
        onStop={handleStop}
      />
      <div
        ref={containerRef}
        className="overflow-hidden relative flex-1 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
      >
        <Stage
          width={stage.width}
          height={stage.height}
          scaleX={stage.scale}
          scaleY={stage.scale}
          ref={stageRef}
        >
          <Layer
            x={(stage.width - DESIGN_WIDTH * stage.scale) / 2}
            y={(stage.height - DESIGN_HEIGHT * stage.scale) / 2}
          >
            <HeatExchanger
              type="Condensor"
              data={condensator}
              position={{ x: 270, y: 50 }}
            />

            <Compressor data={compressor} position={{ x: 200, y: 320 }} />

            {/* Line from compressor to condensor */}
            <Line
              strokeWidth={3}
              stroke="red"
              points={[
                325, 400, 360, 400, 360, 270, 150, 270, 150, 80, 220, 80,
              ]}
            />

            {/* Line from condensor to TEV */}
            <Line
              strokeWidth={3}
              stroke="#FFA276"
              points={[550, 200, 800, 200, 800, 344]}
            />

            <TEV position={{ x: 800, y: 350 }} />

            {/* Line from TEV to evaporator */}
            <Line
              strokeWidth={3}
              stroke="#FFA276"
              points={[800, 382, 800, 480, 750, 480]}
            />

            <HeatExchanger
              type="Evaporator"
              data={evaporator}
              position={{ x: 500, y: 450 }}
              flip={true}
            />

            {/* Line from evaporator to compressor */}
            <Line
              strokeWidth={3}
              stroke="blue"
              points={[480, 600, 100, 600, 100, 430, 200, 430]}
            />
          </Layer>
        </Stage>
      </div>

      <div className="absolute right-0 py-2 px-4 h-32">
        <Controller roomTemp={roomTemp} systemState={systemState} />
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
  )
}
