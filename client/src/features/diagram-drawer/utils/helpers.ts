import {
  PointType,
  ItemType,
  PlacementType,
} from '@/features/diagram-drawer/types'
import Konva from 'konva'

export const dragBounds = (ref: React.RefObject<Konva.Circle>) => {
  if (ref.current !== null) {
    return ref.current.getAbsolutePosition()
  }
  return { x: 0, y: 0 }
}

export const hasIntersection = (position: PointType, item: Konva.Node) => {
  const OFFSET = 30

  return !(
    item.x() - OFFSET > position.x ||
    item.x() + (item.width() + OFFSET) < position.x ||
    item.y() - OFFSET > position.y ||
    item.y() + (item.height() + OFFSET) < position.y
  )
}

export const getAnchorOffset = (
  item: ItemType,
): { offsetX: number; offsetY: number } => {
  if (!item.anchors.offset) return { offsetX: 0, offsetY: 0 }

  const offsetX = 0
  let offsetY = 0

  switch (item.anchors.offset.y) {
    case 'Bottom':
      offsetY = item.height / 2
  }

  return { offsetX, offsetY }
}

export const getOffset = (placement: PlacementType, item: ItemType) => {
  switch (placement) {
    case 'Top':
      return {
        x: item.width / 2,
        y: 0,
      }

    case 'Bottom':
      return {
        x: item.width / 2,
        y: item.height,
      }

    case 'Right':
      return {
        x: item.width,
        y: item.height / 2,
      }

    case 'Left':
      return {
        x: 0,
        y: item.height / 2,
      }
    default:
      return {
        x: 0,
        y: 0,
      }
  }
}
