import { Point } from '@/features/simulator/types'

export const getCondenserGeometry = (position: Point, flip = false) => {
  const coilPoints = generateCoilPoints({ position, flip })

  return {
    ports: {
      inlet: { id: 'condenser.inlet', ...coilPoints[0] },
      outlet: { id: 'condenser.outlet', ...coilPoints[coilPoints.length - 1] },
    },
    coilConnection: {
      id: 'condenser-coil',
      from: coilPoints[0],
      to: coilPoints[coilPoints.length - 1],
      points: coilPoints,
    },
  }
}

export const generateCoilPoints = ({
  numBends = 5,
  startX = 30,
  endX = 220,
  startY = 30,
  spacing = 30,
  flip = false,
  arcSamples = 50,
  position = { x: 0, y: 0 },
}: {
  numBends?: number
  startX?: number
  endX?: number
  startY?: number
  spacing?: number
  flip?: boolean
  arcSamples?: number
  position?: Point
} = {}): Point[] => {
  const coilHeight = (numBends - 1) * spacing
  const points: Point[] = []

  const applyFlip = (x: number, y: number): Point => {
    if (flip) {
      return { x: position.x + x, y: position.y + coilHeight + 60 - y }
    }

    return { x: position.x + x, y: position.y + y }
  }

  for (let i = 0; i < numBends; i++) {
    const y = startY + i * spacing
    const isEven = i % 2 === 0

    if (isEven) {
      points.push(applyFlip(startX, y))
      points.push(applyFlip(endX, y))
    } else {
      points.push(applyFlip(endX, y))
      points.push(applyFlip(startX, y))
    }

    if (i < numBends - 1) {
      const radius = spacing / 2
      const arcCenterY = y + radius
      const arcCenterX = isEven ? endX : startX

      for (let s = 1; s <= arcSamples; s++) {
        const t = s / arcSamples

        const angle = isEven
          ? -Math.PI / 2 + Math.PI * t
          : -Math.PI / 2 - Math.PI * t

        const ax = arcCenterX + radius * Math.cos(angle)
        const ay = arcCenterY + radius * Math.sin(angle)

        points.push(applyFlip(ax, ay))
      }
    }
  }

  return points
}
