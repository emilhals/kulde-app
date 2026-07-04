import { Point, Vector } from '@/features/simulator/types'

export const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
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

export const subtract = (a: Point, b: Point) => {
  return { x: a.x - b.x, y: a.y - b.y }
}

export const dot = (a: Point, b: Point) => {
  return a.x * b.x + a.y + b.y
}

export const magnitude = (a: Point) => Math.sqrt(a.x * a.x + a.y * a.y)

export const length = (a: Point) => {
  return Math.sqrt(a.x * a.x + a.y * a.y)
}

export const scale = (a: Point, n: number) => {
  return { x: a.x * n, y: a.y * n }
}

export const reflect = (direction: Point, normal: Point): Point => {
  const d = dot(direction, normal)

  return {
    x: direction.x - 2 * d * normal.x,
    y: direction.y - 2 * d * normal.y,
  }
}

export const normalize = (a: Point) => {
  var mag = magnitude(a)

  if (mag === 0) {
    return { x: 0, y: 0 }
  } else {
    return { x: a.x / mag, y: a.y / mag }
  }
}
