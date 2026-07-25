import type { ConnectionData } from '@/features/diagram-drawer/types'
import { getAttachmentPosition } from '@/features/diagram-drawer/utils/attachments'
import {
  getConnectionPoints,
  getPointOnSegment,
  getSegmentPositions,
} from '@/features/diagram-drawer/utils/connections'
import Konva from 'konva'
import { useLayoutEffect, useRef, useState } from 'react'
import { Arrow, Group, Rect, Text } from 'react-konva'
import { getClosestPointOnPath } from '@/features/diagram-drawer/utils/connections/segments'

type ConnectionProps = {
  connection: ConnectionData
  foregroundColor: string
  backgroundColor: string
  lineColor: string
}

export const Connection = ({
  connection,
  foregroundColor,
  backgroundColor,
  lineColor,
}: ConnectionProps) => {
  const connectorRef = useRef<Konva.Arrow>(null)
  const textRef = useRef<Konva.Text>(null)

  const hasLabel = connection.label.length >= 1
  const [labelSize, setLabelSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (textRef.current) {
      setLabelSize({
        width: textRef.current.width(),
        height: textRef.current.height(),
      })
    }
  }, [connection.label])

  const fromAnchor = getAttachmentPosition(connection.from)
  const toAnchor = getAttachmentPosition(connection.to)
  const points = getConnectionPoints(connection)
  if (!fromAnchor || !toAnchor || !points) return null

  const segments = getSegmentPositions(points, points.length / 2 - 1)
  const labelPosition = getPointOnSegment(segments.start, segments.end, 0.5)

  return (
    <Group>
      <Arrow
        ref={connectorRef}
        id={connection.id}
        name="connection"
        stroke={lineColor}
        fill={lineColor}
        points={points}
        strokeWidth={2}
        hitStrokeWidth={20}
        perfectDrawEnabled={false}
        pointerAtBeginning={
          connection.arrowMode === 'start' || connection.arrowMode === 'both'
        }
        pointerAtEnding={
          connection.arrowMode === 'end' || connection.arrowMode === 'both'
        }
      />

      {hasLabel && (
        <Group
          x={labelPosition.x}
          y={labelPosition.y}
          draggable
          dragBoundFunc={(pos) => {
            const position = getClosestPointOnPath(pos, points)
            if (!position) return pos

            return { x: position.x, y: position.y }
          }}
        >
          <Rect
            x={-labelSize.width / 2 - 6}
            y={-labelSize.height / 2 - 2}
            width={labelSize.width + 12}
            height={labelSize.height + 4}
            fill={backgroundColor}
          />

          <Text
            ref={textRef}
            text={connection.label}
            fill={foregroundColor}
            fontSize={14}
            x={-labelSize.width / 2}
            y={-labelSize.height / 2}
          />
        </Group>
      )}
    </Group>
  )
}
