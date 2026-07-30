import { Point, Vector } from '@/features/simulator/types'

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max)
}

export const getRotationFromDirection = (dir: Vector) => {
  return (Math.atan2(dir.y, dir.x) * 180) / Math.PI
}

export const getPointBetween = (a: Vector, b: Vector, t: number) => {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

export const rotate = (a: Point, angle: number): Point => {
  const ca = Math.cos(angle)
  const sa = Math.sin(angle)

  const rx = a.x * ca - a.y * sa
  const ry = a.x * sa + a.y * ca

  return { x: rx * -1, y: ry * -1 }
}

export const magnitude = (a: Point) => Math.sqrt(a.x * a.x + a.y * a.y)

export const normalize = (a: Point) => {
  var mag = magnitude(a)

  if (mag === 0) {
    return { x: 0, y: 0 }
  } else {
    return { x: a.x / mag, y: a.y / mag }
  }
}
