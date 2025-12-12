import { Stage as KonvaStage } from 'react-konva'

const Stage = () => {
  return (
    <>
      <KonvaStage
        width={window.innerWidth}
        height={window.innerHeight}
      ></KonvaStage>
    </>
  )
}

export default Stage
