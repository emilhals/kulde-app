import { useRef, useState } from 'react'
import { Line as KonvaLine, Circle } from 'react-konva'
import Konva from 'konva'

import { ConnectionType } from '@/common/types'
import { getConnectionPoints, dragBounds } from '@/lib/utils'

const getLinePoints = (points) => {
  let p = []

  for (let i = 0; i < (points.length / 2); i++) {
    p[i] = {
      x: points[i * 2],
      y: points[i * 2 + 1]
    }
  }
  return p
}

export const Line = ({ connection }: { connection: ConnectionType }) => {
  const connectorRef = useRef(null)
  const circle = useRef(null)

  const [activePoints, setActivePoints] = useState<Konva.Circle[]>([])
  const [dragging, setDragging] = useState<boolean>(false)

  const points = getConnectionPoints(connection.from, connection.to, connection)
  if (!points) return

  const handlePointerEnter = () => {
    console.log(connection)

    const k = getLinePoints(points)

    const circles = k.map((position) => {
      return (
        <Circle
          ref={circle}
          offsetX={-connection.offsets.from.position.x}
          offsetY={-connection.offsets.from.position.y}
          x={position.x}
          y={position.y}
          stroke='black'
          strokeWidth={1}
          fill='#2d9cbd'
          radius={5}
          draggable={true}
          onDragStart={handleDragStart}
          dragBoundFunc={() => dragBounds(circle)}
        />
      )
    })

    setActivePoints(circles)
  }

  const handlePointerLeave = () => {
    if (!dragging)
      setActivePoints([])
  }

  const handleDragStart = () => {
    setDragging(true)
  }

  return (
    <>
      <KonvaLine
        ref={connectorRef}
        x={connection.offsets.from.position.x}
        y={connection.offsets.from.position.y}
        points={points}
        stroke="black"
        strokeWidth={2}
        hitStrokeWidth={50}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        perfectDrawEnabled={false}
      />
      {activePoints}
    </>
  )
}
