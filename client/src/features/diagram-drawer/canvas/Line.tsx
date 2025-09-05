import { useRef, useState } from 'react'
import { Line as KonvaLine, Circle } from 'react-konva'

import { ConnectionType } from '@/features/diagram-drawer/types'
import { dragBounds } from '@/features/diagram-drawer/utils/helpers'
import { getConnectionPoints } from '@/features/diagram-drawer/utils/getConnectionPoints'

const getLinePoints = (points: number[]) => {
  const p = []

  for (let i = 0; i < points.length / 2; i++) {
    p[i] = {
      x: points[i * 2],
      y: points[i * 2 + 1],
    }
  }
  return p
}

export const Line = ({ connection }: { connection: ConnectionType }) => {
  const connectorRef = useRef(null)
  const circle = useRef(null)

  const [activePoints, setActivePoints] = useState<JSX.Element[]>([])
  const [dragging, setDragging] = useState<boolean>(false)

  const points = getConnectionPoints(connection.from, connection.to, connection)
  if (!points) return

  const handlePointerEnter = () => {
    const k = getLinePoints(points)

    const circles = k.map((position, index) => {
      return (
        <Circle
          ref={circle}
          key={index}
          offsetX={-connection.offsets.from.position.x}
          offsetY={-connection.offsets.from.position.y}
          x={position.x}
          y={position.y}
          fill="#1c1c1c"
          radius={5}
          onClick={() => console.log('clicked')}
          draggable={true}
          onDragStart={handleDragStart}
          dragBoundFunc={() => dragBounds(circle)}
        />
      )
    })

    setActivePoints(circles)
  }

  const handlePointerLeave = () => {
    if (!dragging) setActivePoints([])
  }

  const handleDragStart = () => {
    setDragging(true)
  }

  return (
    <>
      <KonvaLine
        ref={connectorRef}
        key={connection.id}
        x={connection.offsets.from.position.x}
        y={connection.offsets.from.position.y}
        points={points}
        stroke="#1c1c1c"
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
