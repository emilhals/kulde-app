import { useState, useEffect } from 'react'
import { Stage, Layer } from 'react-konva'

import Part from '../components/simulator/Part'

function SimulatorPage() {
  /* general */
  const [refrigerant, setRefrigerant] = useState<string>("R404A")
  const [cooling, setCooling] = useState<Boolean>(false)

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
    <div className="container relative mx-auto px-4">
      <h3 className="font-bold text-4xl left-10 fixed top-5"> Simulator.</h3>
      <div className="fixed top-5 right-5">
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

      <button className="absolute mt-10 z-10" onClick={() => setCooling(!cooling)}>{cooling ? 'Stop' : 'Start'}</button>
      <Stage className="fixed left-0 top-0 z-0" width={screenWidth} height={screenHeight}>
        <Layer>
          <Part type="Compressor" x={screenWidth / 2} y={(3 * screenHeight) / 4}></Part>
          <Part type="Condensor" x={(3 * screenWidth) / 4} y={screenHeight / 2}></Part>
          <Part type="TEV" x={screenWidth / 2} y={screenHeight / 4}></Part>
          <Part type="Evaporator" x={screenWidth / 4} y={screenHeight / 2}></Part>
        </Layer>
      </Stage>
    </div>
  )
}

export default SimulatorPage
