import { Rect, Text } from 'react-konva'

function Evaporator() {
  return(
    <>
      <Text fontSize={30} x={window.innerWidth / 3.05} y={870} text="Evaporator" align="center" wrap="char" width={700}/>
      <Rect x={window.innerWidth / 2} y={750} width={100} height={100} fill="green" />
    </>
  )
}

export default Evaporator
