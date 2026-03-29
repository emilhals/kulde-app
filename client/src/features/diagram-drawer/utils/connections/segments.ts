import { PointType } from '@/features/diagram-drawer/types'
/*
https://www.youtube.com/watch?v=egmZJU-1zPU
*/
export const getClosestPointOnSegment = (p: any, a: any, b: any) => {
    const ab = { x: b.x - a.x, y: b.y - a.y }
    const ap = { x: p.x - a.x, y: p.y - a.y }

    const abLenSq = ab.x * ab.x + ab.y * ab.y
    const proj = ap.x * ab.x + ap.y * ab.y

    let d = proj / abLenSq
    let t = Math.max(0, Math.min(1, d))

    return {
        x: a.x + ab.x * t,
        y: a.y + ab.y * t,
        t,
    }
}

export const getPointOnSegment = (
    start: PointType,
    end: PointType,
    t: number,
): PointType => {
    return {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
    }
}

export const getSegmentPositions = (
    points: number[],
    segmentIndex: number,
): { start: PointType; end: PointType } | null => {
    if (points.length < 4 || segmentIndex < 0) return null

    const segmentCount = points.length / 2 - 1
    if (segmentCount <= 0) return null

    const i = Math.min(segmentIndex, segmentCount - 1)

    const start = {
        x: points[i * 2],
        y: points[i * 2 + 1],
    }

    const end = {
        x: points[(i + 1) * 2],
        y: points[(i + 1) * 2 + 1],
    }

    return { start, end }
}

export const interpolateMidPoint = (start: number, end: number) => {
    return start + (end - start) / 2
}
