import { useCustomFont } from '@/features/shared/hooks/useCustomFont'
import { useResponsiveStage } from '@/features/shared/hooks/useResponsiveStage'
import { Compressor } from '@/features/simulator/canvas/Compressor'
import { HeatExchanger } from '@/features/simulator/canvas/HeatExchanger'
import { PipeNetwork } from '@/features/simulator/canvas/PipeNetwork'
import { PressureGauge } from '@/features/simulator/canvas/PressureGauge'
import { TEV } from '@/features/simulator/canvas/TEV'
import { motion } from 'motion/react'

import {
  compressorPosition,
  condenserPosition,
  evaporatorPosition,
  pipes,
  tevPosition,
} from '@/features/simulator/physics/positions'
import type { Point } from '@/features/simulator/types'
import { Controller } from '@/features/simulator/ui/Controller'
import { useClickAway } from '@uidotdev/usehooks'
import Konva from 'konva'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Group, Layer, Stage } from 'react-konva'
import { useSnapshot } from 'valtio'
import { useSimulationSocket } from './hooks/useSimulationSocket'
import { simulationState } from './stores/simulation'
import { uiState } from './stores/ui'
import { InformationPanel } from './ui/InformationPanel'
import { InstructionsPanel } from './ui/InstructionsPanel'
import { ParametersPanel } from './ui/ParametersPanel'
import { PlaybackButton } from './ui/PlaybackButton'
import { SimulationMenu } from './ui/SimulationMenu'
import { setActivePanel } from './stores/ui.actions'

export const SimulatorPage = () => {
  const { t } = useTranslation('simulator')

  const [,] = useCustomFont('Inter')
  const {
    connectionStatus,
    startSimulation,
    restartSimulation,
    stopSimulation,
  } = useSimulationSocket()

  const uiSnap = useSnapshot(uiState)
  const simulationSnap = useSnapshot(simulationState)
  const systemSnap = useSnapshot(simulationState.system)

  const controls = simulationSnap.controls
  const components = simulationSnap.components

  const containerRef = useRef<HTMLDivElement>(null)
  const stage = useResponsiveStage(containerRef)

  const parametersPanelRef = useClickAway<HTMLDivElement>(() => {
    if (
      uiState.activePanel === 'parameters' &&
      !uiState.panels.parameters.isPinned
    ) {
      setActivePanel(null)
    }
  })

  const instructionsPanelRef = useClickAway<HTMLDivElement>(() => {
    if (
      uiState.activePanel === 'instructions' &&
      !uiState.panels.instructions.isPinned
    ) {
      setActivePanel(null)
    }
  })

  const groupRef = useRef<Konva.Group>(null)
  const [groupPosition, setGroupPosition] = useState<Point>({ x: 0, y: 0 })

  useEffect(() => {
    if (!groupRef.current || !stage) return
    const group = groupRef.current

    const { width, height } = group.getClientRect()
    const x = stage.width / 2 - width / 2
    const y = stage.height / 2 - height / 2

    setGroupPosition({ x: x - 50, y: y })
  }, [groupRef, stage])

  return (
    <motion.div layout className="flex h-full min-h-0 w-full gap-2 px-2 py-2">
      <motion.main
        layout
        id="container"
        ref={containerRef}
        tabIndex={0}
        className={
          'relative flex-1 overflow-hidden rounded-lg border border-gray-300 bg-zinc-100 bg-[radial-gradient(#D9D9D9_1px,transparent_1px)] bg-[length:16px_16px] focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:bg-[radial-gradient(#3a3a3a_1px,transparent_1px)]'
        }
      >
        <div className="absolute left-6 top-6 z-30 flex h-full max-w-96 flex-col gap-4 transition-opacity ease-in-out">
          <Controller roomTemp={systemSnap.roomTemp} />
        </div>

        <div ref={parametersPanelRef}>
          {uiSnap.activePanel === 'parameters' && <ParametersPanel />}
        </div>

        <div ref={instructionsPanelRef}>
          {uiSnap.activePanel === 'instructions' && <InstructionsPanel />}
        </div>

        <div className="absolute right-6 top-6 z-30 flex items-center gap-3">
          <PlaybackButton onStart={startSimulation} onStop={stopSimulation} />
          <SimulationMenu
            onStart={startSimulation}
            onRestart={restartSimulation}
            onStop={stopSimulation}
          />
        </div>

        <div className="absolute flex-1">
          {stage && (
            <Stage width={stage.width} height={stage.height}>
              <Layer>
                <Group ref={groupRef} x={groupPosition.x} y={groupPosition.y}>
                  <Compressor
                    position={compressorPosition}
                    label="Compressor"
                  />
                  <HeatExchanger
                    label="condensor"
                    data={components.condensor}
                    position={condenserPosition}
                  />

                  <TEV position={tevPosition} scale={0.75} />
                  <HeatExchanger
                    label="evaporator"
                    data={components.condensor}
                    position={evaporatorPosition}
                  />

                  <PressureGauge
                    type="HP"
                    inlet={{ x: 100, y: 400 }}
                    pressure={
                      simulationSnap.components.compressor.discharge_pressure
                        .value
                    }
                  />
                  <PressureGauge
                    type="LP"
                    inlet={{ x: 440, y: 420 }}
                    pressure={
                      simulationSnap.components.compressor.suction_pressure
                        .value
                    }
                  />
                </Group>
              </Layer>

              <Layer>
                <Group x={groupPosition.x} y={groupPosition.y}>
                  <PipeNetwork
                    animate={controls.status === 'running'}
                    pressure={{ LP: 3, HP: 8 }}
                    pipes={pipes}
                  />
                </Group>
              </Layer>
            </Stage>
          )}
        </div>

        {connectionStatus !== 'active' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center">
            <div className="rounded-md p-5 text-sm text-red-800 shadow">
              {connectionStatus === 'connecting'
                ? t('connecting') + '...'
                : t('no-connection')}
            </div>
          </div>
        )}
      </motion.main>
      <InformationPanel show={true} />
    </motion.div>
  )
}
