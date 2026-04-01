import {
    Attachment,
    ConnectionType,
    Placement,
} from '@/features/diagram-drawer/types'

import { getAttachmentPosition } from '@/features/diagram-drawer/utils/attachments'
import {
    interpolateMidPoint,
    toPoints,
} from '@/features/diagram-drawer/utils/connections'

const getPlacement = (attachment: Attachment): Placement | undefined => {
    if (attachment.type === 'item') return attachment.placement
    return undefined
}

const getConnectionType = (start: Placement, end: Placement) => {
    const isVertical =
        (start === 'Bottom' && end === 'Top') ||
        (start === 'Top' && end === 'Bottom')
    const isHorizontal =
        (start === 'Left' && end === 'Right') ||
        (start === 'Right' && end === 'Left')

    if (start === end) {
        return 'same'
    }

    if (isVertical || (isHorizontal && start !== end)) return 'opposite'

    return 'perpendicular'
}

const scorePath = (pointsFlat: number[]) => {
    let score = 100

    const points = toPoints(pointsFlat)
    let segments = []
    for (let i = 0; i < points.length - 1; i++) {
        segments.push({
            start: points[i],
            end: points[i + 1],
        })
    }
    const bendAmount = segments.length - 1
    let segmentLength = 0

    for (let i = 0; i < segments.length; i++) {
        segmentLength += Math.sqrt(
            (segments[i].end.x - segments[i].start.x) ** 2 +
                (segments[i].end.y - segments[i].start.y) ** 2,
        )
    }

    const lastSegment = segments[segments.length - 1].end
    const bend = segments[0].end
    const distBendToEnd = Math.sqrt(
        (lastSegment.x - bend.x) ** 2 + (lastSegment.y - bend.y) ** 2,
    )

    score -= bendAmount * 10 + Math.ceil(distBendToEnd)

    return score
}

const findBestPath = (paths: number[][]) => {
    let bestPath = paths[0]
    let bestScore = scorePath(paths[0])

    for (let i = 1; i < paths.length; i++) {
        if (scorePath(paths[i]) >= bestScore) {
            bestPath = paths[i]
        }
    }

    return bestPath
}

export const getConnectionPoints = (connection: ConnectionType) => {
    const startPos = getAttachmentPosition(connection.from)
    const endPos = getAttachmentPosition(connection.to)

    if (!endPos || !startPos) return null

    const startPlacement = getPlacement(connection.from)
    const endPlacement = getPlacement(connection.to)

    const OFFSET = Math.max(40, Math.abs(startPos.y - endPos.y) / 2)

    const type = getConnectionType(startPlacement, endPlacement)

    const dy = Math.abs(startPos.y - endPos.y)
    const dx = Math.abs(startPos.x - endPos.x)

    const isVertical =
        (startPlacement === 'Top' && endPlacement === 'Bottom') ||
        (startPlacement === 'Bottom' && endPlacement === 'Top')

    const isHorizontal =
        (startPlacement === 'Left' && endPlacement === 'Right') ||
        (startPlacement === 'Right' && endPlacement === 'Left')

    if (
        dy < 8 ||
        (dx < 8 &&
            ((startPlacement === 'Left' && endPlacement === 'Right') ||
                (startPlacement === 'Right' && endPlacement === 'Left') ||
                (startPlacement === 'Top' && endPlacement === 'Bottom') ||
                (startPlacement === 'Bottom' && endPlacement === 'Top')))
    ) {
        return [startPos.x, startPos.y, endPos.x, endPos.y]
    }

    const midX = interpolateMidPoint(startPos.x, endPos.x)

    if (type === 'opposite') {
        if (isHorizontal) {
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

        if (isVertical) {
            return [
                startPos.x,
                startPos.y,
                startPos.x,
                startPos.y + OFFSET,
                endPos.x,
                startPos.y + OFFSET,
                endPos.x,
                endPos.y,
            ]
        }
    }

    if (type === 'perpendicular') {
        let verticalPath = [
            startPos.x,
            startPos.y,
            startPos.x,
            endPos.y,
            endPos.x,
            endPos.y,
        ]

        let horizontalPath = [
            startPos.x,
            startPos.y,
            endPos.x,
            startPos.y,
            endPos.x,
            endPos.y,
        ]

        const paths = [verticalPath, horizontalPath]
        const best = findBestPath(paths)

        return best
    }

    if (type === 'same') {
        const left = startPos.x - midX
        const right = endPos.x - midX

        const leftPath = [
            startPos.x,
            startPos.y,
            startPos.x - OFFSET,
            startPos.y,
            startPos.x - OFFSET,
            endPos.y,
            endPos.x,
            endPos.y,
        ]

        const rightPath = [
            startPos.x,
            startPos.y,
            endPos.x - OFFSET,
            startPos.y,
            endPos.x - OFFSET,
            endPos.y,
            endPos.x,
            endPos.y,
        ]

        return left < right ? leftPath : rightPath
    }
}
