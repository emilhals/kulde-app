import { useState, useEffect } from 'react'
import { Stage, Layer, Circle } from 'react-konva'

function Simulator() {
  /* general */
  const [refrigerant, setRefrigerant] = useState("R404A")
  const [cooling, setCooling] = useState(false)

  /* temperatures */
  const [temperature, setTemperature] = useState(24)
  const [SP, setSP] = useState(4)

  /* pressures */ 
  const [LP, setLP] = useState()
  const [HP, setHP] = useState()
  
  const getPressures = (temperature) => {
    fetch(`http://localhost:8000/simulator/${refrigerant}/${temperature}/get-pressures`).then(res => res.json()).then(data => {
      setLP(data.LP / 1e5)
      setHP(data.HP / 1e5)
    })
  }

  useEffect(() => {
    let interval;
    if (cooling && temperature > SP) {
      interval = setInterval(() => {
        setTemperature(temperature => temperature - 1);
        getPressures(temperature);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [temperature, cooling])

  return(
    <div className="container mx-auto px-4">
      <h3 className="font-bold text-4xl fixed top-5"> Simulator.</h3>
      <div>
      <h3 className="font-bold text-xl">Information</h3>
      <p>Room Temperature: {temperature}</p>
      <p>Set Point: {SP}</p>
      <p>Refrigerant: {refrigerant}</p>
      <p>LP: {LP}</p>
      <p>HP: {HP}</p>
 
      <button onClick={() => setCooling(!cooling)}>{cooling ? 'Stop' : 'Start'}</button>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Circle x={200} y={100} radius={50} fill="green" />
        </Layer>
      </Stage>    
      </div>
    </div>
  )
}

export default Simulator
