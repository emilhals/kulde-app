import { useState, useEffect } from 'react'
import { Stage, Layer } from 'react-konva'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { SquarePowerIcon } from 'lucide-react'

import Part from '../components/simulator/Part'

import { ACTIONS } from "../constants"
function SimulatorPage() {
  /* general */
  const [refrigerant, setRefrigerant] = useState<string>("R404A")
  const [cooling, setCooling] = useState<Boolean>(false)

  const [powerOn, setPowerOn] = useState<Boolean>(false)

  /* regulator */
  const [SP, setSP] = useState<number>(4)

  /* temperatures */
  const [temperature, setTemperature] = useState<number>(24)
  const [evaporator, setEvaporator] = useState<number>(24)
  const [condensor, setCondensor] = useState<number>(24)
  const [SH, setSH] = useState<number>()

  /* pressures */
  const [LP, setLP] = useState<number>()
  const [HP, setHP] = useState<number>()
  const [LP_temp, setLP_temp] = useState<number>(0)

  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  const getPressures = (temperature: number) => {
    fetch(`http://localhost:8000/simulator/${refrigerant}/${temperature}/get-pressures`).then(res => res.json()).then(data => {
      setLP(data.LP / 1e5)
      setHP(data.HP / 1e5)
    })
  }
  const [action, setAction] = useState<string>(ACTIONS.SELECT)
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (cooling && temperature > SP) {
      interval = setInterval(() => {
        setTemperature(temperature => temperature - 1)
        getPressures(temperature)

        if (evaporator > -4) {
          setEvaporator(evaporator => evaporator - 2)
        }

        if (condensor < 35) {
          setCondensor(condensor => condensor + 2)
        }

        setSH(evaporator - LP_temp)

      }, 2000);
    }

    return () => clearInterval(interval);
  }, [temperature, cooling])

  return (
    <div className="grid row-span-2 ">
      <div className="">
        <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button onClick={() => setPowerOn(!powerOn)} className={powerOn === true ? "bg-red-600 p-1 rounded" : "p-1 hover:bg-red-500 rounded"}>
                  <SquarePowerIcon className="size-5"></SquarePowerIcon>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {powerOn && (
                  <p>Power off</p>
                )}
                {!powerOn && (
                  <p>Power on</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Stage className="border-blue-50" width={screenWidth} height={screenHeight}>
          <Layer>
            <Part type="Compressor" x={screenWidth / 2} y={(3 * screenHeight) / 4}></Part>
            <Part type="Condensor" x={(3 * screenWidth) / 2} y={screenHeight / 4}></Part>
            <Part type="TEV" x={screenWidth / 2} y={screenHeight / 4}></Part>
            <Part type="Evaporator" x={screenWidth / 4} y={screenHeight / 2}></Part>
          </Layer>
        </Stage>
      </div>

      <div className="absolute top-5 right-5">
        <h3 className="font-bold text-xl">Information</h3>
        <p>Room Temperature: {temperature}</p>
        <p>Set Point: {SP}</p>
        <p>Refrigerant: {refrigerant}</p>
        <p>LP: {LP?.toFixed(2)} bar</p>
        <p>HP: {HP?.toFixed(2)} bar</p>
        <p>Evaporator: {evaporator} C</p>
        <p>Condensor: {condensor} C</p>
        <p>Superheat: {SH}</p>
      </div>

    </div>
  )
}

export default SimulatorPage
