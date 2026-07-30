import { GRID_BLOCK_SIZE } from '@/features/diagram-drawer/constants/canvas'
import { Point } from '@/features/simulator/types'

export const snapToGrid = (value: number, gridSize = GRID_BLOCK_SIZE) =>
  Math.round(value / gridSize) * gridSize

export const snapPointToGrid = (
  position: Point,
  gridSize = GRID_BLOCK_SIZE,
) => ({
  x: snapToGrid(position.x, gridSize),
  y: snapToGrid(position.y, gridSize),
})
