import { Rect, Text } from 'react-konva'

function Evaporator() {
  return(
    <>
      <Text fontSize={30} x={-55} y={530} text="Evaporator" align="center" wrap="char" width={700}/>
      <Rect x={window.innerWidth / 7} y={window.innerHeight / 3} width={100} height={100} fill="black" />
    </>
  )
}

export default Evaporator
