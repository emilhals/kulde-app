import { PointType } from '@/common/types'
import Konva from 'konva'

export const dragBounds = (ref: React.RefObject<Konva.Circle>) => {
  if (ref.current !== null) {
    return ref.current.getAbsolutePosition()
  }
  return { x: 0, y: 0 }
}

export const hasIntersection = (position: PointType, item: Konva.Shape) => {
  let OFFSET = 30

  return !(
    item.x() - OFFSET > position.x ||
    item.x() + (item.width() + OFFSET) < position.x ||
    item.y() - OFFSET > position.y ||
    item.y() + (item.height() + OFFSET) < position.y
  )
}
