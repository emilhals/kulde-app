import { useRef, useState } from 'react'
import { Line as KonvaLine, Circle } from 'react-konva'

import { ConnectionType } from '@/features/diagram-drawer/types'
import { getConnectionPoints } from '@/features/diagram-drawer/utils/getConnectionPoints'
import { diagramHistory } from '@/features/diagram-drawer/store'

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

    const from = diagramHistory.value.items.find(
        (i) => i.id === connection.fromId,
    )

    const to = diagramHistory.value.items.find((i) => i.id === connection.toId)

    if (!from || !to) return null

    const [showPoints, setShowPoints] = useState(false)
    const [dragging, setDragging] = useState<boolean>(false)

    const points = getConnectionPoints(from, to, connection)
    if (!points) return null

    const handlePointerEnter = () => {
        setShowPoints(true)
    }

    const handlePointerLeave = () => {
        if (!dragging) setShowPoints(false)
    }

    const handleDragStart = () => {
        setDragging(true)
    }

    const handleDragEnd = () => {
        setDragging(false)
        setShowPoints(false)
    }

    return (
        <>
            <KonvaLine
                ref={connectorRef}
                key={connection.id}
                points={points}
                stroke="#1c1c1c"
                strokeWidth={2}
                hitStrokeWidth={50}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                perfectDrawEnabled={false}
            />
            {showPoints &&
                getLinePoints(points).map((position, index) => (
                    <Circle
                        key={index}
                        x={position.x}
                        y={position.y}
                        fill="#1c1c1c"
                        radius={5}
                        draggable
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        dragBoundFunc={(pos) => pos}
                    />
                ))}
        </>
    )
}
