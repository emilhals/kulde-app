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

export const hasIntersection = (position: PointType, item: Konva.Shape) => {
  const OFFSET = 30

  return !(
    item.x() - OFFSET > position.x ||
    item.x() + (item.width() + OFFSET) < position.x ||
    item.y() - OFFSET > position.y ||
    item.y() + (item.height() + OFFSET) < position.y
  )
}

export const getOffset = (placement: PlacementType, item: ItemType) => {
  switch (placement) {
    case 'top':
      return {
        x: item.width / 2,
        y: item.height / 2,
      }

    case 'bottom':
      return {
        x: item.width / 2,
        y: item.height,
      }

    case 'right':
      return {
        x: item.width,
        y: item.height / 2,
      }

    case 'left':
      return {
        x: item.width / 2,
        y: item.height / 2,
      }
    default:
      return {
        x: 0,
        y: 0,
      }
  }
}
