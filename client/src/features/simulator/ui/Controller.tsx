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
import { controllerState, paramKeys } from '../store'

type DisplayMode = {
  display: 'DEFAULT' | 'PARAMETERS' | 'ALARMS' | 'DEF. TEMP'
  mode: 'STATIC' | 'CHANGE'
}

export const Controller = ({ roomTemp }: { roomTemp: number }) => {
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
  const [isLongPress, setIsLongPress] = useState<boolean>(false)

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
      setIsLongPress(true)
    }, 500)
    setIsLongPress(false)
  }

  const handleInput = (buttonPlacement: string, isLongPress: boolean) => {
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
      handleInput(e.currentTarget.id, false)
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
      <div className="flex flex-row justify-center items-center w-96 h-32 text-white bg-black rounded-lg border-4 border-gray-500 shadow-md shadow-black">
        <div className="flex flex-col gap-y-3 justify-center px-3 text-gray-300">
          <Snowflake size={18} />
          <CloudSnow size={18} />
          <Fan size={18} />
        </div>

        <div className="flex justify-center items-center w-80 h-24 bg-gray-800 rounded-lg">
          <div className="flex py-2 text-5xl font-lubrifont">
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
        <div className="flex flex-col gap-y-3 justify-center items-center px-2 w-36">
          <div className="flex justify-between items-center w-full">
            <span className="flex justify-center w-4">
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
              className="flex-1 mx-2 h-6 bg-gray-800 rounded-lg border-gray-700 shadow-md transition-all duration-150 active:border-gray-700 [box-shadow:0_4px_0_0_#202020,0_3px_0_0_#1b404040] border-[1px] active:translate-y-[1px] active:[box-shadow:0_1px_0_0_#404040,0_1px_0_0_#404040] active:border-b-[0px]"
            />
            <span>
              <Wrench
                className="flex justify-center w-4 -rotate-90"
                size={16}
              />
            </span>
          </div>

          <div className="flex justify-between items-center w-full tracking-wider">
            <span className="flex justify-center w-4 text-xs tracking-tight">
              SET
            </span>
            <button
              id="center"
              onMouseDown={handleMouseDown}
              onClick={handleClick}
              onMouseUp={handleMouseUp}
              className="flex-1 mx-2 h-6 bg-gray-800 rounded-lg border-gray-700 shadow-md transition-all duration-150 active:border-gray-700 [box-shadow:0_4px_0_0_#202020,0_3px_0_0_#1b404040] border-[1px] active:translate-y-[1px] active:[box-shadow:0_1px_0_0_#404040,0_1px_0_0_#404040] active:border-b-[0px]"
            />
            <span className="w-4" />
          </div>

          <div className="flex justify-between items-center w-full">
            <span className="flex justify-center w-4">
              <ThermometerSnowflake size={16} />
            </span>
            <button
              id="bottom"
              onMouseDown={handleMouseDown}
              onClick={handleClick}
              onMouseUp={handleMouseUp}
              className="flex-1 mx-2 h-6 bg-gray-800 rounded-lg border-gray-700 shadow-md transition-all duration-150 active:border-gray-700 [box-shadow:0_4px_0_0_#202020,0_3px_0_0_#1b404040] border-[1px] active:translate-y-[1px] active:[box-shadow:0_1px_0_0_#404040,0_1px_0_0_#404040] active:border-b-[0px]"
            />

            <span>
              <SunSnow
                className="flex justify-center w-4 -rotate-90"
                size={16}
              />
            </span>
          </div>
        </div>
      </div>
      <div className="flex">
        <span>{displayMode.mode + ' | ' + displayMode.display}</span>
      </div>
    </div>
  )
}
