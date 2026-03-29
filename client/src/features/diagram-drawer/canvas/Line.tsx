import { useRef } from 'react'
import { Circle, Group, Line as KonvaLine } from 'react-konva'

import Konva from 'konva'

import { ConnectionType } from '@/features/diagram-drawer/types'
import { getAttachmentPosition } from '@/features/diagram-drawer/utils/attachments'
import { getConnectionPoints } from '@/features/diagram-drawer/utils/connections'

export const Line = ({
    connection,
    onSelect,
    isSelected,
}: {
    connection: ConnectionType
    onSelect: (e: Konva.KonvaEventObject<PointerEvent>) => void
    isSelected: boolean
}) => {
    const connectorRef = useRef(null)

    const fromAnchor = getAttachmentPosition(connection.from)
    const toAnchor = getAttachmentPosition(connection.to)

    if (!fromAnchor || !toAnchor) return null

    const points = getConnectionPoints(connection)
    if (!points) return null

    return (
        <Group>
            <KonvaLine
                id={connection.id}
                ref={connectorRef}
                key={connection.id}
                points={points}
                stroke="#1c1c1c"
                strokeWidth={2}
                hitStrokeWidth={20}
                perfectDrawEnabled={false}
                onPointerDown={onSelect}
            />

            {isSelected && (
                <Group>
                    <Circle
                        x={fromAnchor.x}
                        y={fromAnchor.y}
                        fill="#1c1c1c"
                        radius={5}
                        hitStrokeWidth={20}
                        draggable
                    />

                    <Circle
                        x={toAnchor.x}
                        y={toAnchor.y}
                        fill="#1c1c1c"
                        radius={5}
                        draggable
                    />
                </Group>
            )}
        </Group>
    )
}
