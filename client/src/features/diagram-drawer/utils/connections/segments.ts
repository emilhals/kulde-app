import { Point } from '@/features/diagram-drawer/types'
/*
https://www.youtube.com/watch?v=egmZJU-1zPU
*/
export const getClosestPointOnSegment = (p: Point, a: Point, b: Point) => {
  const ab = { x: b.x - a.x, y: b.y - a.y }
  const ap = { x: p.x - a.x, y: p.y - a.y }

  const abLenSq = ab.x * ab.x + ab.y * ab.y
  const proj = ap.x * ab.x + ap.y * ab.y

  const d = proj / abLenSq
  const t = Math.max(0, Math.min(1, d))

  return { x: a.x + ab.x * t, y: a.y + ab.y * t, t }
}

export const getPointOnSegment = (
  start: Point,
  end: Point,
  t: number,
): Point => {
  return {
    x: start.x + (end.x - start.x) * t,
    y: start.y + (end.y - start.y) * t,
  }
}

export const getSegmentPositions = (
  points: number[],
  segmentIndex: number,
): { start: Point; end: Point } => {
  const segmentCount = points.length / 2 - 1

  const i = Math.min(segmentIndex, segmentCount - 1)

  const start = { x: points[i * 2], y: points[i * 2 + 1] }
  const end = { x: points[(i + 1) * 2], y: points[(i + 1) * 2 + 1] }

  return { start, end }
}

export const getClosestPointOnPath = (position: Point, points: number[]) => {
  let closest = null
  let closestDistance = Infinity

  const segmentCount = points.length / 2 - 1

  for (let i = 0; i < segmentCount; i++) {
    const segment = getSegmentPositions(points, i)

    const candidate = getClosestPointOnSegment(
      position,
      segment.start,
      segment.end,
    )

    const dx = candidate.x - position.x
    const dy = candidate.y - position.y

    const dis = dx * dx + dy * dy

    if (dis < closestDistance) {
      closestDistance = dis
      closest = candidate
    }
  }

  return closest
}
