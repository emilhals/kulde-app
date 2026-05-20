import {
    Attachment,
    Connection,
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

const getDistance = (a, b) => {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

const getDirection = (a, b, c) => {
    const segment1Horizontal = a.y === b.y
    const segment1Vertical = a.x === b.x
    const segment2Horizontal = b.y === c.y
    const segment2Vertical = b.x === c.x

    if ((a.x === b.x && b.x === c.x) || (a.y === b.y && b.y === c.y)) {
        return 'none'
    } else if (
        !(segment1Vertical || segment1Horizontal) ||
        !(segment2Vertical || segment2Horizontal)
    ) {
        return 'unknown'
    } else if (segment1Horizontal && segment2Vertical) {
        return c.y > b.y ? 's' : 'n'
    } else {
        return c.x > b.x ? 'e' : 'w'
    }
}

const simplifyPath = (points) => {
    if (points.length <= 2) {
        return points
    }
    const r = [points[0]]
    for (let i = 1; i < points.length; i++) {
        const cur = points[i]

        if (i === points.length - 1) {
            r.push(cur)
        } else if (getDirection(points[i - 1], cur, points[i + 1]) !== 'none') {
            r.push(cur)
        }
    }
    return r
}

function trace(points, radius) {
    if (points.length <= 1) return

    const path = [points[0].x, points[0].y]

    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1],
            current = points[i],
            { x, y } = current,
            next = points[i + 1]

        if (next) {
            const d1 = getDistance(prev, current),
                d2 = getDistance(current, next),
                r2 = radius * 2,
                r = d1 < r2 || d2 < r2 ? Math.min(d1 / 2, d2 / 2) : radius,
                fromW = prev.x < x,
                fromN = prev.y < y
            switch (getDirection(prev, current, next)) {
                case 's':
                    path.push(fromW ? x - r : x + r, y)
                    //c.lineTo(fromW ? x - r : x + r, y)
                    //c.quadraticCurveTo(x, y, x, y + r)
                    break
                case 'n':
                    path.push(fromW ? x - r : x + r, y)
                    //c.lineTo(fromW ? x - r : x + r, y)
                    //c.quadraticCurveTo(x, y, x, y - r)
                    break
                case 'e':
                    path.push(x, fromN ? y - r : y + r)
                    //c.lineTo(x, fromN ? y - r : y + r)
                    //c.quadraticCurveTo(x, y, x + r, y)
                    break
                case 'w':
                    path.push(x, fromN ? y - r : y + r)
                    //c.lineTo(x, fromN ? y - r : y + r)
                    //c.quadraticCurveTo(x, y, x - r, y)
                    break
                default:
                    path.push(x, y)
                    //c.lineTo(x, y)
                    break
            }
        } else {
            path.push(current.x, current.y)
        }
    }
    return path
}

const scorePath = (pointsFlat: number[]) => {
    let score = 100

    const points = toPoints(pointsFlat)
    const segments = []
    for (let i = 0; i < points.length - 1; i++) {
        segments.push({
            start: points[i],
            end: points[i + 1],
        })
    }
    const bendAmount = segments.length - 1

    /*
    let segmentLength = 0

    for (let i = 0; i < segments.length; i++) {
        segmentLength += Math.sqrt(
            (segments[i].end.x - segments[i].start.x) ** 2 +
                (segments[i].end.y - segments[i].start.y) ** 2,
        )
    }*/

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
    const bestScore = scorePath(paths[0])

    for (let i = 1; i < paths.length; i++) {
        if (scorePath(paths[i]) >= bestScore) {
            bestPath = paths[i]
        }
    }

    return bestPath
}

export const getConnectionPoints = (connection: Connection) => {
    const startPos = getAttachmentPosition(connection.from)
    const endPos = getAttachmentPosition(connection.to)

    if (!endPos || !startPos) return null

    const startPlacement = getPlacement(connection.from) as Placement
    const endPlacement = getPlacement(connection.to) as Placement

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
        const verticalPath = [
            startPos.x,
            startPos.y,
            startPos.x,
            endPos.y,
            endPos.x,
            endPos.y,
        ]

        const horizontalPath = [
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
