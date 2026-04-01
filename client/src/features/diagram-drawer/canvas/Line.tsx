import { useRef } from 'react'
import { Line as KonvaLine } from 'react-konva'

import { ConnectionType } from '@/features/diagram-drawer/types'
import { getAttachmentPosition } from '@/features/diagram-drawer/utils/attachments'
import { getConnectionPoints } from '@/features/diagram-drawer/utils/connections'

export const Line = ({ connection }: { connection: ConnectionType }) => {
    const connectorRef = useRef(null)
    const fromAnchor = getAttachmentPosition(connection.from)
    const toAnchor = getAttachmentPosition(connection.to)

    if (!fromAnchor || !toAnchor) return null

    const points = getConnectionPoints(connection)
    if (!points) return null

    return (
        <KonvaLine
            id={connection.id}
            ref={connectorRef}
            key={connection.id}
            points={points}
            stroke="#1c1c1c"
            strokeWidth={2}
            hitStrokeWidth={20}
            perfectDrawEnabled={false}
        />
    )
}
