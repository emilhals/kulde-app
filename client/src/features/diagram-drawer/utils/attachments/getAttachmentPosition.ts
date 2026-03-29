import { getFromStore } from '@/features/diagram-drawer/store/actions'
import { Attachment, PointType } from '@/features/diagram-drawer/types'

import {
    getConnectionPoints,
    getPointOnSegment,
    getSegmentPositions,
} from '@/features/diagram-drawer/utils/connections'
import { getAttachmentOffset } from './getAttachmentOffset'

export const getAttachmentPosition = (
    attachment: Attachment,
): PointType | null => {
    if (attachment.type === 'free') return attachment.position

    if (attachment.type === 'item') {
        const item = getFromStore(attachment.itemId, 'items')
        if (!item || item.type !== 'items') return null

        const offset = getAttachmentOffset(attachment.placement, item)

        return {
            x: item.x + offset.x,
            y: item.y + offset.y,
        }
    }

    if (attachment.type === 'connection') {
        const targetConnection = getFromStore(
            attachment.connectionId,
            'connections',
        )
        if (!targetConnection) return null

        const sourceAttachment = getAttachmentPosition(targetConnection.from)
        const endAttachment = getAttachmentPosition(targetConnection.to)

        if (!sourceAttachment || !endAttachment) return null

        const connectionPoints = getConnectionPoints(targetConnection)

        if (!connectionPoints) return null

        const segmentPositions = getSegmentPositions(
            connectionPoints,
            attachment.segmentIndex,
        )
        if (!segmentPositions) return null

        return getPointOnSegment(
            segmentPositions.start,
            segmentPositions.end,
            attachment.t,
        )
    }

    return null
}
