import { useEffect, useState, useRef } from 'react'
import { Stage } from 'react-konva'

import { Play, Pause, FastForward, Rewind } from 'lucide-react'

import { useSnapshot } from 'valtio'
import { controllerState } from '@/features/simulator/store'

import useWebSocket, { ReadyState } from 'react-use-websocket-lite'

import Controller from '@/features/simulator/ui/Controller'

const SimulatorPage = () => {
  const url = 'http://127.0.0.1:8000/ws'
  const [messages, setMessages] = useState<string[]>([])

  const [roomTemp, setRoomTemp] = useState<number>(24)
  const controllerSnap = useSnapshot(controllerState)

  const flatParams = Object.fromEntries(
    Object.entries(controllerState.parameters).map(([key, param]) => [
      key,
      param.value,
    ]),
  )
  const { sendMessage, readyState } = useWebSocket({
    url: url,
    onMessage(event) {
      setMessages((prev) => [...prev, JSON.parse(event.data)])
      setRoomTemp(JSON.parse(event.data).room_temp)
      console.log('yeah', JSON.parse(event.data).room_temp)
    },
  })

  console.log(messages)

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

      <h3>{controllerSnap.view}</h3>

      <Stage width={window.innerWidth} height={window.innerHeight}></Stage>
    </div>
  )
}

export default SimulatorPage
