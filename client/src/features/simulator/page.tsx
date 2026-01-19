import { useEffect, useState, useRef } from 'react'
import { Stage } from 'react-konva'

import { Play, Pause, FastForward, Rewind } from 'lucide-react'

import { useSnapshot, subscribe } from 'valtio'
import { controllerState } from '@/features/simulator/store'

import useWebSocket, { ReadyState } from 'react-use-websocket-lite'

import Controller from '@/features/simulator/ui/Controller'

import { Compressor, Evaporator, Condensator } from './types'

const SimulatorPage = () => {
    const url = 'http://127.0.0.1:8000/ws'
    const [messages, setMessages] = useState<string[]>([])

    const [roomTemp, setRoomTemp] = useState<number>(24)
    const controllerSnap = useSnapshot(controllerState)

    const [compressor, setCompressor] = useState<Compressor>()

    const [evaporator, setEvaporator] = useState<Evaporator>()
    const [condensator, setCondensator] = useState<Condensator>()

    subscribe(controllerState.parameters, () => {
        if (controllerState.view == 'DISPLAY') {
            console.log("state changes to", controllerState.parameters)
        }
    })

    const flatParams = Object.fromEntries(
        Object.entries(controllerState.parameters).map(([key, param]) => [
            key,
            param.value,
        ]),
    )
    const { sendMessage, readyState } = useWebSocket({
        url: url,
        onMessage(event) {
            const data = JSON.parse(event.data)
            setMessages((prev) => [...prev, data])
            setRoomTemp(data.Room.room_temp)

            setEvaporator({
                suction_pressure: JSON.parse(event.data).Evaporator.suction_pressure,
                suction_temperature: JSON.parse(event.data).Evaporator.suction_temp,
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

    const [systemConditions, setSystemConditions] = useState({
        is_running: false,
        refrigerant: 'R404a',
    })

    const [simulationStatus, setSimulationStatus] = useState<'run' | 'pause'>(
        'pause',
    )

    useEffect(() => {
        console.log('Connection status: ', connectionStatus)
    }, [connectionStatus])

    useEffect(() => {
        if (readyState === ReadyState.OPEN && systemConditions.is_running) {
            console.log('sending')
            sendMessage(
                JSON.stringify({
                    command: 'start',
                    systemConditions: systemConditions,
                    controllerParams: flatParams,
                }),
            )
        }
    }, [readyState, sendMessage, systemConditions])

    return (
        <div className="h-32">
            <div className="flex px-16 py-8 flex-row gap-x-2 fixed left-0 z-50">
                <h3>{controllerSnap.view}</h3>
                <button>
                    <Rewind size={20} />
                </button>

                {systemConditions.is_running && (
                    <button
                        onClick={() =>
                            setSystemConditions({ ...systemConditions, is_running: false })
                        }
                    >
                        <Pause size={20} />
                    </button>
                )}

                {!systemConditions.is_running && (
                    <button
                        onClick={() =>
                            setSystemConditions({ ...systemConditions, is_running: true })
                        }
                    >
                        <Play size={20} />
                    </button>
                )}

                <button>
                    <FastForward size={20} />
                </button>
            </div>
            <div className="bg-gray-100 py-2 px-4 h-32 absolute right-0 z-50">
                <Controller roomTemp={roomTemp} />
            </div>

            <div className="fixed bottom-0 flex flex-row">
                <div className="flex flex-col">
                    <h3>Run state: {compressor?.run_state}</h3>
                    <h3>Discharge temp: {compressor?.discharge_temp}</h3>
                    <h3>Discharge pressure: {compressor?.discharge_pressure}</h3>
                </div>

                <div className="flex flex-col">
                    <h3>LP: {evaporator?.suction_pressure}</h3>
                    <h3>Suction temp: {evaporator?.suction_temperature}</h3>
                </div>

                <div className="flex flex-col">
                    <h3>HP: {condensator?.condensing_pressure}</h3>
                    <h3>Condensor temp: {condensator?.condensing_temperature}</h3>
                    <h3>Liquid temp: {condensator?.liquid_temp}</h3>
                </div>
            </div>
            <Stage width={window.innerWidth} height={window.innerHeight}></Stage>
        </div>
    )
}

export default SimulatorPage
