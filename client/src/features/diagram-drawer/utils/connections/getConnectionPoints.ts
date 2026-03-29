import {
    Attachment,
    ConnectionType,
    Placement,
} from '@/features/diagram-drawer/types'

import { getAttachmentPosition } from '@/features/diagram-drawer/utils/attachments'
import { interpolateMidPoint } from './segments.ts'

const getPlacement = (attachment: Attachment): Placement | undefined => {
    if (attachment.type === 'item') return attachment.placement
    return undefined
}

export const getConnectionPoints = (connection: ConnectionType) => {
    const startPos = getAttachmentPosition(connection.from)
    const endPos = getAttachmentPosition(connection.to)

    if (!endPos || !startPos) return null

    const startPlacement = getPlacement(connection.from)
    const endPlacement = getPlacement(connection.to)

    const dy = Math.abs(startPos.y - endPos.y)
    const dx = Math.abs(startPos.x - endPos.x)

    if (dy < 5 || dx < 5) {
        return [startPos.x, startPos.y, endPos.x, endPos.y]
    }

    const midX = interpolateMidPoint(startPos.x, endPos.x)
    const midY = interpolateMidPoint(startPos.y, endPos.y)

    if (
        (startPlacement === 'Left' || startPlacement === 'Right') &&
        (endPlacement === 'Left' || endPlacement === 'Right')
    ) {
        return [
            startPos.x,
            startPos.y,
            midX,
            startPos.y,
            midX,
            endPos.y,
            endPos.x,
            endPos.y,
        ]
    }
    if (
        (startPlacement === 'Top' || startPlacement === 'Bottom') &&
        (endPlacement === 'Top' || endPlacement === 'Bottom')
    ) {
        return [
            startPos.x,
            startPos.y,
            startPos.x,
            midY,
            endPos.x,
            midY,
            endPos.x,
            endPos.y,
        ]
    }

    if (
        (startPlacement === 'Right' && endPlacement === 'Left') ||
        (startPlacement === 'Left' && endPlacement === 'Right')
    ) {
        return [
            startPos.x,
            startPos.y,
            midX,
            startPos.y,
            midX,
            endPos.y,
            endPos.x,
            endPos.y,
        ]
    }

    if (
        (startPlacement === 'Left' || startPlacement === 'Right') &&
        (endPlacement === 'Top' || endPlacement === 'Bottom')
    ) {
        return [
            startPos.x,
            startPos.y,
            endPos.x,
            startPos.y,
            endPos.x,
            endPos.y,
        ]
    }

    if (
        (startPlacement === 'Top' && endPlacement === 'Bottom') ||
        (startPlacement === 'Bottom' && endPlacement === 'Top')
    ) {
        const midY = interpolateMidPoint(startPos.y, endPos.y)

        return [
            startPos.x,
            startPos.y,
            startPos.x,
            midY,
            endPos.x,
            midY,
            endPos.x,
            endPos.y,
        ]
    }

    return [startPos.x, startPos.y, endPos.x, endPos.y]
}
