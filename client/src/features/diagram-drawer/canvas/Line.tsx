import { Connection } from '@/features/diagram-drawer/types'
import { getAttachmentPosition } from '@/features/diagram-drawer/utils/attachments'
import { getConnectionPoints } from '@/features/diagram-drawer/utils/connections'
import { useRef, useState } from 'react'
import { Line as KonvaLine } from 'react-konva'

export const Line = ({ connection }: { connection: Connection }) => {
    const connectorRef = useRef(null)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const fromAnchor = getAttachmentPosition(connection.from)
    const toAnchor = getAttachmentPosition(connection.to)

    if (!fromAnchor || !toAnchor) return null

    const points = getConnectionPoints(connection)
    if (!points) return null

    return (
        <KonvaLine
            ref={connectorRef}
            id={connection.id}
            name="connection"
            key={connection.id}
            points={points}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            stroke={isHovered ? '#404040' : '#1c1c1c'}
            strokeWidth={isHovered ? 3.5 : 2}
            hitStrokeWidth={20}
            perfectDrawEnabled={false}
        />
    )
}
