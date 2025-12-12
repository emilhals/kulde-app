import { useState, useEffect } from 'react'
import { useLongPress } from '@uidotdev/usehooks'
import { ChevronUp, ChevronDown, Fan, Snowflake, CloudSnow } from 'lucide-react'

import { controllerState } from '../store'
import { useSnapshot } from 'valtio'

export type ParamType = {
  index: number
  code: string
  information: string
  value: number | string
}

const Parameters: ParamType[] = [
  {
    index: 0,
    code: 'u56',
    information: 'Temperature Display',
    value: 24,
  },
  {
    index: 1,
    code: 'setPoint',
    information: 'Setpoint',
    value: 4,
  },
  {
    index: 2,
    code: 'r01',
    information: 'Differential',
    value: 4,
  },
  {
    index: 3,
    code: 'r12',
    information: 'Controll engine',
    value: 0,
  },
]

const Controller = ({ roomTemp }: { roomTemp: number }) => {
  const controllerSnap = useSnapshot(controllerState)
  controllerState.parameters.u56.value = Math.floor(roomTemp)

  const attrs = useLongPress(
    () => {
      controllerState.view = 'EDIT'
    },
    {
      onStart: (event) => console.log('Press started'),
      onFinish: (event) => console.log('pRESS FINISIHED'),
      onCancel: (event) => (controllerState.view = 'DISPLAY'),
      threshold: 500,
    },
  )

  const [paramIndex, setParamIndex] = useState<number>(0)
  const [currentParam, setCurrentParam] = useState<ParamType>(
    Parameters[paramIndex],
  )

  useEffect(() => {
    setCurrentParam(Parameters[paramIndex])
  }, [paramIndex, currentParam])

  const handlePressUp = () => {
    if (controllerState.view == 'DISPLAY') {
      if (Parameters[paramIndex - 1]) {
        setParamIndex(paramIndex - 1)
      }
    }

    if (
      controllerState.view === 'EDIT' &&
      controllerState.parameters[currentParam.code]
    ) {
      controllerState.parameters[currentParam.code].value += 1
    }
  }

  const handlePressDown = () => {
    if (controllerState.view == 'DISPLAY') {
      if (Parameters[paramIndex + 1]) {
        setParamIndex(paramIndex + 1)
      }
    }

    if (controllerState.view === 'EDIT') {
      controllerState.parameters[currentParam.code].value -= 1
    }
  }

  return (
    <div className="flex flex-row w-96 h-32 bg-black border-4 shadow-md shadow-black border-gray-500 text-white justify-center rounded-lg">
      <div className="flex flex-col justify-center text-gray-300 px-3 gap-y-3">
        <Snowflake size={18} />
        <CloudSnow size={18} />
        <Fan size={18} />
      </div>

      <div className="flex bg-gray-950 rounded-lg w-96 items-center justify-center">
        <div className="flex text-white  items-center inset-2 shadwjustify-center">
          <span
            className={`font-lubrifont text-4xl ${controllerSnap.view === 'DISPLAY' ? 'text-white' : 'text-gray-400'}`}
          >
            {currentParam?.code === 'u56' || controllerSnap.view === 'EDIT'
              ? controllerSnap.parameters[currentParam.code].value +
                `${currentParam.code === 'u56' ? '°C' : ''}`
              : currentParam.code}
          </span>
        </div>
      </div>
      <div className="flex flex-col px-2 gap-y-3 items-center justify-center">
        <div className="flex flex-row gap-x-2 justify-center items-center">
          <button
            className="bg-black hover:text-gray-400"
            onMouseDown={handlePressUp}
          >
            <ChevronUp size={20} />
          </button>
        </div>

        <div className="flex flex-row gap-x-2 justify-center items-center font-google-sans-code tracking-wider text-md">
          <button
            {...attrs}
            onDoubleClick={() => (controllerState.view = 'DISPLAY')}
            className="bg-gray-800 shadow-sm shadow-white border-2 border-gray-500 text-white px-4 py-1 rounded-lg hover:bg-gray-700"
          >
            SET
          </button>
        </div>

        <div className="flex flex-row gap-x-2 justify-center items-center">
          <button
            className="bg-black hover:text-gray-400"
            onMouseDown={handlePressDown}
          >
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controller
