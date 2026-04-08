import { useEffect, useState, useRef } from 'react'
import { Stage, Layer, Line, Text } from 'react-konva'
import Konva from 'konva'

import { Play, RotateCw, Square, Zap, ZapOff } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { useSnapshot, subscribe } from 'valtio'
import {
    controllerState,
    initialControllerState,
} from '@/features/simulator/store'

import useWebSocket, { ReadyState } from 'react-use-websocket-lite'

import Controller from '@/features/simulator/ui/Controller'

import { CompressorType, EvaporatorType, CondensatorType } from './types'
import HeatExchanger from '@/features/simulator/canvas/HeatExchanger'
import Compressor from '@/features/simulator/canvas/Compressor'
import TEV from '@/features/simulator/canvas/TEV'
import { deepClone } from 'valtio/utils'

const SimulatorPage = () => {
    const url = 'http://127.0.0.1:8000/ws'
    const [messages, setMessages] = useState<string[]>([])

    const restartingRef = useRef<boolean>(false)

    const stageRef = useRef<Konva.Stage>(null)

    const [roomTemp, setRoomTemp] = useState<number>(24)
    const controllerSnap = useSnapshot(controllerState)

    const [compressor, setCompressor] = useState<CompressorType>({
        power_state: 'OFF',
        run_state: 'IDLE',
        discharge_pressure: 10,
        discharge_temp: 24,
        suction_pressure: 6,
        suction_temperature: 24,
    })

    /* TODO: Give default values */
    const [evaporator, setEvaporator] = useState<EvaporatorType>({
        fan_speed: 0,
    })
    const [condensator, setCondensator] = useState<CondensatorType>({
        fan_speed: 0,
    })

    subscribe(controllerState, () => {
        if (controllerState.view === 'DISPLAY') return
        console.log('values', controllerState)
    })

    const flatParams = Object.fromEntries(
        Object.entries(controllerSnap.parameters).map(([key, param]) => [
            key,
            param.value,
        ]),
    )

    const { sendMessage, readyState } = useWebSocket({
        url: url,
        onMessage(event) {
            if (restartingRef.current) return

            const data = JSON.parse(event.data)

            if (data.status === 'STOPPED') {
                restartingRef.current = false
                setSimulationStatus('IDLE')
                return
            }

            if (data.status === 'RUNNING') {
                setSimulationStatus('RUNNING')
            }

            setMessages((prev) => [...prev, data])
            setRoomTemp(data.Room.room_temp)

            setEvaporator({
                suction_pressure: JSON.parse(event.data).Evaporator
                    .suction_pressure,
                suction_temperature: JSON.parse(event.data).Evaporator
                    .suction_temp,
            })
            setCondensator({
                condensing_pressure: data.Condensator.condensing_pressure,
                condensing_temperature: data.Condensator.condensing_temp,
                liquid_temp: data.Condensator.liquid_temp,
                subcooling: data.Condensator.subcooling,
            })

            setCompressor({
                power_state: data.Compressor.power_state,
                run_state: data.Compressor.run_state,
                discharge_pressure: data.Compressor.discharge_pressure,
                discharge_temp: data.Compressor.discharge_temp,
                suction_pressure: JSON.parse(event.data).Evaporator
                    .suction_pressure,
                suction_temperature: JSON.parse(event.data).Evaporator
                    .suction_temp,
            })
        },
    })

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState]

    const [simulationStatus, setSimulationStatus] = useState<
        'RUNNING' | 'STOPPING' | 'RESTARTING' | 'IDLE'
    >('IDLE')

    useEffect(() => {
        if (stageRef.current) {
            const container = stageRef.current.container()
            container.style.backgroundColor = '#f3f4f6'
        }
    }, [])

    useEffect(() => {
        console.log('Connection status: ', connectionStatus)
    }, [connectionStatus])

    const handlePlay = () => {
        if (readyState !== ReadyState.OPEN) return

        sendMessage(
            JSON.stringify({
                command: 'start',
                controllerParams: flatParams,
            }),
        )

        setSimulationStatus('RUNNING')
    }

    const handleStop = () => {
        if (readyState !== ReadyState.OPEN) return

        sendMessage(
            JSON.stringify({
                command: 'STOP',
            }),
        )

        setSimulationStatus('STOPPING')
    }

    const handleRestart = () => {
        if (readyState !== ReadyState.OPEN) return

        const controllerStateReset = deepClone(initialControllerState)

        controllerState.view = controllerStateReset.view

        Object.keys(controllerState.parameters).forEach((key) => {
            delete controllerState.parameters[key]
        })

        Object.entries(controllerStateReset.parameters).forEach(
            ([key, value]) => {
                controllerState.parameters[key] = value
            },
        )

        const resetParams = Object.fromEntries(
            Object.entries(initialControllerState.parameters).map(
                ([key, param]) => [key, param.value],
            ),
        )

        setRoomTemp(24)
        sendMessage(
            JSON.stringify({
                command: 'RESTART',
                controllerParams: resetParams,
            }),
        )

        setSimulationStatus('RESTARTING')
    }

    return (
        <div className="h-32">
            <div className="flex px-12 py-8 flex-row gap-x-4 fixed left-0 z-50">
                {simulationStatus}
                <Tooltip>
                    <TooltipTrigger asChild>
                        {simulationStatus == 'RUNNING' && (
                            <button
                                className="bg-transparent"
                                onClick={handleStop}
                            >
                                <Square size={16} />
                            </button>
                        )}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Stop simulation</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {simulationStatus !== 'RUNNING' && (
                            <button
                                className="bg-transparent"
                                onClick={handlePlay}
                            >
                                <Play size={16} />
                            </button>
                        )}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Start simulation</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="bg-transparent"
                            onClick={handleRestart}
                        >
                            <RotateCw size={16} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Restart simulation</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="bg-gray-100 py-2 px-4 h-32 absolute right-0 z-50">
                <Controller roomTemp={roomTemp} />
                <h3>{controllerSnap.view}</h3>
            </div>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                ref={stageRef}
            >
                <Layer>
                    <HeatExchanger
                        type="Condensor"
                        data={condensator}
                        position={{ x: 270, y: 150 }}
                    />

                    <Compressor
                        data={compressor}
                        position={{ x: 200, y: 520 }}
                    />

                    {/* Line from compressor to condensor */}
                    <Line
                        strokeWidth={3}
                        stroke="red"
                        points={[
                            325, 600, 360, 600, 360, 400, 150, 400, 150, 180,
                            220, 180,
                        ]}
                    />

                    {/* Line from condensor to TEV */}
                    <Line
                        strokeWidth={3}
                        stroke="#FFA276"
                        points={[550, 300, 800, 300, 800, 444]}
                    />

                    <TEV position={{ x: 800, y: 450 }} />

                    {/* Line from TEV to evaporator */}
                    <Line
                        strokeWidth={3}
                        stroke="#FFA276"
                        points={[800, 482, 800, 630, 750, 630]}
                    />

                    <HeatExchanger
                        type="Evaporator"
                        data={evaporator}
                        position={{ x: 500, y: 600 }}
                        flip={true}
                    />

                    {/* Line from evaporator to compressor */}
                    <Line
                        strokeWidth={3}
                        stroke="blue"
                        points={[480, 750, 100, 750, 100, 600, 200, 600]}
                    />
                </Layer>
            </Stage>
        </div>
    )
}

export default SimulatorPage
