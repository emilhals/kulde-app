import { controllerState, paramKeys } from '@/features/simulator/store/models'
import { SystemState } from '@/features/simulator/types'
import { getTemperatureUnit } from '@/features/simulator/utils/getTemperatureUnit'
import {
  CloudSnow,
  Fan,
  Snowflake,
  SunSnow,
  ThermometerSnowflake,
  Wrench,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useSnapshot } from 'valtio'

type DisplayMode = {
  display: 'DEFAULT' | 'PARAMETERS' | 'ALARMS' | 'DEF. TEMP'
  mode: 'STATIC' | 'CHANGE'
}

type ControllerProps = { roomTemp: string; systemState: SystemState }

export const Controller = ({ roomTemp, systemState }: ControllerProps) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>({
    display: 'DEFAULT',
    mode: 'STATIC',
  })

  const showRoomTemp =
    displayMode.display === 'DEFAULT' && displayMode.mode === 'STATIC'
  const editSetPoint =
    displayMode.display === 'DEFAULT' && displayMode.mode === 'CHANGE'
  const showParameters =
    displayMode.display === 'PARAMETERS' && displayMode.mode === 'STATIC'
  const editParameters =
    displayMode.display === 'PARAMETERS' && displayMode.mode === 'CHANGE'

  const pressTimer = useRef<number>()
  const isLongPressRef = useRef<boolean>(false)

  const [blinkClass, setBlinkClass] = useState<string>('')
  const [blinkKey, setBlinkKey] = useState<number>(0)

  const triggerBlink = (animationClass: string) => {
    setBlinkClass(animationClass)
    setBlinkKey((k) => k + 1)
  }

  const controllerSnap = useSnapshot(controllerState)

  const [paramIndex, setParamIndex] = useState<number>(0)
  const currentKey = paramKeys[paramIndex]
  const currentParamSnap = controllerSnap.parameters[currentKey]
  const currentParamState = controllerState.parameters[currentKey]

  controllerState.setPoint.max = controllerSnap.parameters['r02'].value
  controllerState.setPoint.min = controllerSnap.parameters['r03'].value

  const startPressTimer = () => {
    isLongPressRef.current = false
    pressTimer.current = window.setTimeout(() => {
      isLongPressRef.current = true
    }, 500)
  }

  const handleInput = (buttonPlacement: string) => {
    if (editSetPoint) {
      if (buttonPlacement === 'center') {
        setDisplayMode((prev) => ({ ...prev, mode: 'STATIC' }))
        triggerBlink('animate-blink-twice')
      } else {
        handleParamChange(buttonPlacement)
      }
    }

    if (showParameters) {
      handlePagination(buttonPlacement)
    }

    if (editParameters) {
      handleParamChange(buttonPlacement)
      if (buttonPlacement === 'center') {
        setDisplayMode((prev) => ({ ...prev, mode: 'STATIC' }))
        triggerBlink('animate-blink-once')
      }
    }
  }

  const handlePagination = (buttonPlacement: string) => {
    if (buttonPlacement === 'center') {
      setDisplayMode((prev) => ({ ...prev, mode: 'CHANGE' }))
      return
    }

    const delta = buttonPlacement === 'top' ? -1 : 1
    let next = paramIndex + delta

    if (paramKeys[next]) {
      setParamIndex(next)
    } else {
      next = buttonPlacement === 'top' ? paramKeys.length - 1 : 0
      setParamIndex(next)
    }
  }

  const handleParamChange = (buttonPlacement: string) => {
    const param = editSetPoint ? controllerState.setPoint : currentParamState
    const delta = buttonPlacement === 'top' ? 1 : -1

    let next = param.value + delta

    if (param.max !== undefined) {
      next = Math.min(next, param.max)
    }

    if (param.min !== undefined) {
      next = Math.max(next, param.min)
    }

    param.value = next
  }

  const renderDisplay = () => {
    if (showRoomTemp) {
      return roomTemp + getTemperatureUnit(controllerSnap.parameters.r05.value)
    }

    if (editSetPoint) {
      return (
        controllerSnap.setPoint.value +
        getTemperatureUnit(controllerSnap.parameters.r05.value)
      )
    }

    if (showParameters) {
      return currentKey
    }

    if (editParameters) {
      return currentParamSnap.value
    }
  }

  const handleMouseDown = () => {
    startPressTimer()
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLongPressRef.current) {
      const buttonPlacement = e.currentTarget.id

      switch (buttonPlacement) {
        case 'top':
          if (showRoomTemp)
            setDisplayMode({ display: 'PARAMETERS', mode: 'STATIC' })
          break
        case 'center':
          if (showParameters)
            setDisplayMode({ display: 'DEFAULT', mode: 'STATIC' })
          break
        case 'bottom':
          break
      }
    } else {
      handleInput(e.currentTarget.id)
    }

    if (showRoomTemp) {
      if (e.currentTarget.id === 'center') {
        setDisplayMode({ ...displayMode, mode: 'CHANGE' })
      }
    }
  }

  const handleMouseUp = () => {
    clearTimeout(pressTimer.current)
  }

  return (
    <div className="flex flex-col">
      <div className="flex h-32 w-96 flex-row items-center justify-center rounded-lg border-4 border-gray-500 bg-black text-white shadow-md shadow-black">
        <div className="flex flex-col justify-center gap-y-3 px-3 text-gray-300">
          <Snowflake
            className={systemState.isCooling ? 'text-white' : 'text-gray-600'}
            size={18}
          />
          <CloudSnow
            className={
              systemState.isDefrosting ? 'text-white' : 'text-gray-600'
            }
            size={18}
          />
          <Fan
            className={systemState.runningFans ? 'text-white' : 'text-gray-600'}
            size={18}
          />
        </div>

        <div className="flex h-24 w-80 items-center justify-center rounded-lg bg-gray-800">
          <div className="flex py-2 font-lubrifont text-5xl">
            <span
              className={'absolute text-5xl blur-xl font-bold text-red-800'}
            >
              {renderDisplay()}
            </span>
            <h3
              key={blinkKey}
              className={`relative font-extrabold text-red-400  ${editParameters || editSetPoint ? 'animate-blink-infinite' : blinkClass}`}
            >
              {renderDisplay()}
            </h3>
          </div>
        </div>
        <div className="flex w-36 flex-col items-center justify-center gap-y-3 px-2">
          <div className="flex w-full items-center justify-between">
            <span className="flex w-4 justify-center">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 20"
              >
                <rect
                  x=""
                  y="6"
                  width="4"
                  height="8"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />
                <polygon
                  points="4 7, 24 6, 16 14, 4 13"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <button
              id="top"
              onMouseDown={handleMouseDown}
              onClick={handleClick}
              onMouseUp={handleMouseUp}
              className="mx-2 h-6 flex-1 rounded-lg border-[1px] border-gray-700 bg-gray-800 shadow-md transition-all duration-150 [box-shadow:0_4px_0_0_#202020,0_3px_0_0_#1b404040] active:translate-y-[1px] active:border-b-[0px] active:border-gray-700 active:[box-shadow:0_1px_0_0_#404040,0_1px_0_0_#404040]"
            />
            <span>
              <Wrench
                className="flex w-4 -rotate-90 justify-center"
                size={16}
              />
            </span>
          </div>

          <div className="flex w-full items-center justify-between tracking-wider">
            <span className="flex w-4 justify-center text-xs tracking-tight">
              SET
            </span>
            <button
              id="center"
              onMouseDown={handleMouseDown}
              onClick={handleClick}
              onMouseUp={handleMouseUp}
              className="mx-2 h-6 flex-1 rounded-lg border-[1px] border-gray-700 bg-gray-800 shadow-md transition-all duration-150 [box-shadow:0_4px_0_0_#202020,0_3px_0_0_#1b404040] active:translate-y-[1px] active:border-b-[0px] active:border-gray-700 active:[box-shadow:0_1px_0_0_#404040,0_1px_0_0_#404040]"
            />
            <span className="w-4" />
          </div>

          <div className="flex w-full items-center justify-between">
            <span className="flex w-4 justify-center">
              <ThermometerSnowflake size={16} />
            </span>
            <button
              id="bottom"
              onMouseDown={handleMouseDown}
              onClick={handleClick}
              onMouseUp={handleMouseUp}
              className="mx-2 h-6 flex-1 rounded-lg border-[1px] border-gray-700 bg-gray-800 shadow-md transition-all duration-150 [box-shadow:0_4px_0_0_#202020,0_3px_0_0_#1b404040] active:translate-y-[1px] active:border-b-[0px] active:border-gray-700 active:[box-shadow:0_1px_0_0_#404040,0_1px_0_0_#404040]"
            />

            <span>
              <SunSnow
                className="flex w-4 -rotate-90 justify-center"
                size={16}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
