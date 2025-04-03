import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import Konva from 'konva'

import { ItemType, PointType, ConnectionType } from '@/common/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/*
 * For the connection related components
 */
export const createConnectionPoints = (destination: PointType, sourceAnchor: Konva.Shape, destinationAnchor: Konva.Shape) => {
  let OFFSET = 200

  let nullPoint: PointType = {
    x: 0,
    y: 0
  }

  let midPoint: PointType = {
    x: 0,
    y: 0
  }

  if (destinationAnchor) {
    if (sourceAnchor.x() !== destinationAnchor.x()) {
      if (sourceAnchor.id() === 'right' && destinationAnchor.id() === 'left') {
        return [destination.x / 2, 0, destination.x / 2, destination.y, destination.x, destination.y]
      }
      if (sourceAnchor.id() === 'right' && destinationAnchor.id() === 'bottom') {
        return [destination.x, 0, destination.x, destination.y]
      }
      if (sourceAnchor.id() === 'right' && destinationAnchor.id() === 'right') {
        return [destination.x + 200, 0, destination.x + 200, destination.y, destination.x, destination.y]
      }
      if (sourceAnchor.id() === 'right' && destinationAnchor.id() === 'top') {
        return [destination.x / 2, 0, destination.x / 2, destination.y - 100, destination.x, destination.y - 100, destination.x, destination.y]
      }

      if (sourceAnchor.id() === 'left' && destinationAnchor.id() === 'top') {
        return [0, 0, destination.x, 0, destination.x, destination.y - (destination.y / 2), destination.x, destination.y]
      }

      if (sourceAnchor.id() === 'left' && destinationAnchor.id() === 'bottom') {
        return [0, 0, destination.x, 0, destination.x, destination.y - (destination.y / 2), destination.x, destination.y]
      }

      if (sourceAnchor.id() === 'top' && destinationAnchor.id() === 'left') {
        return [0, 0, 0, destination.y, destination.x, destination.y]
      }
      if (sourceAnchor.id() === 'top' && destinationAnchor.id() === 'bottom') {
        console.log('ade')
        return [0, 0, destination.x, destination.y, destination.x, destination.y]
      }
      if (sourceAnchor.id() === 'top' && destinationAnchor.id() === 'right') {
        return [0, destination.y, destination.x, destination.y, destination.x, destination.y]
      }
      if (sourceAnchor.id() === 'top' && destinationAnchor.id() === 'top') {
        return [0, destination.y - 100, destination.x, destination.y - 100, destination.x, destination.y - 100, destination.x, destination.y]
      }

      if (sourceAnchor.id() === 'bottom' && destinationAnchor.id() === 'left') {
        return [0, destination.y, destination.x, destination.y, destination.x, destination.y, destination.x, destination.y]
      }

    }
  } else {
    if ((destination.x - nullPoint.x) > OFFSET) {
      return [nullPoint.x, nullPoint.y, destination.x / 2, 0, destination.x / 2, destination.y, destination.x, destination.y]
    }
    return [nullPoint.x, nullPoint.y, midPoint.x, midPoint.y, destination.x, destination.y]
  }
}

export const getConnectionPoints = (from: ItemType, to: ItemType, connection: ConnectionType) => {

  if (connection.offsets.from.placement === 'top' && connection.offsets.to.placement === 'bottom') {
    if (connection.from.x - connection.to.x > 50 || connection.from.x - connection.to.x < -50) {
      return [from.x, from.y - connection.offsets.from.position.y, to.x, to.y, from.x, to.y, to.x, to.y]
    }
    return [from.x, from.y - connection.offsets.from.position.y, from.x, to.y + connection.offsets.to.position.y / 2]
  }

  if (connection.offsets.from.placement === 'top' && connection.offsets.to.placement === 'top') {
    return [from.x, from.y - connection.offsets.from.position.y, to.x, to.y, to.x + connection.offsets.to.position.x / 2, to.y + connection.offsets.to.position.y]
  }

  if (connection.offsets.from.placement === 'top' && connection.offsets.to.placement === 'right') {
    return [from.x, from.y - connection.offsets.from.position.y, from.x, to.y, to.x + connection.offsets.to.position.x / 2, to.y]
  }

  if (connection.offsets.from.placement === 'top' && connection.offsets.to.placement === 'left') {
    return [from.x, from.y - connection.offsets.from.position.y, from.x, to.y, to.x - connection.offsets.to.position.x, to.y]
  }

  if (connection.offsets.from.placement === 'right' && connection.offsets.to.placement === 'bottom') {
    return [from.x, from.y, to.x - connection.offsets.to.position.x, from.y, to.x - connection.offsets.to.position.x, to.y + connection.offsets.to.position.y / 2]
  }

  if (connection.offsets.from.placement === 'right' && connection.offsets.to.placement === 'top') {
    return [from.x, from.y, to.x - connection.offsets.to.position.x, from.y, to.x - connection.offsets.to.position.x, to.y - connection.offsets.to.position.y]
  }

  if (connection.offsets.from.placement === 'left' && connection.offsets.to.placement === 'top') {
    return [from.x, from.y, to.x, from.y, to.x, to.y - connection.offsets.to.position.y]
  }

  if (connection.offsets.from.placement === 'left' && connection.offsets.to.placement === 'bottom') {
    return [from.x - connection.offsets.from.position.x, from.y, to.x, from.y, to.x, to.y + connection.offsets.to.position.y / 2]
  }


  if (connection.offsets.from.placement === 'bottom' && connection.offsets.to.placement === 'left') {
    return [from.x, from.y, from.x, to.y - connection.offsets.to.position.y, to.x - connection.offsets.to.position.x, to.y - connection.offsets.to.position.y]
  }
}

export const getAnchorPoints = (from: ItemType, to: ItemType, connection: Conn) => {

}


export const getOffset = (placement: string, item: ItemType) => {
  switch (placement) {
    case 'top':
      return {
        x: item.width / 2,
        y: item.height / 2
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
        y: 0
      }
  }
}

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
