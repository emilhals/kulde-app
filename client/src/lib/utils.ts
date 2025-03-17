import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { ItemType, PointType, ConnectionType } from '@/common/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/*
 * For the connection related components
 */
export const createConnectionPoints = (destination: PointType, sourceAnchor: string, destinationAnchor: string) => {
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

      /*
      if (sourceAnchor.id() === 'top' && destinationAnchor.id() === 'left') {
        return [destination.x / 2, 0, destination.x / 2, destination.y, destination.x, destination.y]
      }*/
      if (sourceAnchor.id() === 'top' && destinationAnchor.id() === 'bottom') {
        return [0, destination.y - 100, destination.x, destination.y + 100, destination.x, destination.y + 100, destination.x, destination.y]
      }
      if (sourceAnchor.id() === 'top' && destinationAnchor.id() === 'right') {
        return [0, destination.y, destination.x, destination.y, destination.x, destination.y]
      }
      if (sourceAnchor.id() === 'top' && destinationAnchor.id() === 'top') {
        return [0, destination.y - 100, destination.x, destination.y - 100, destination.x, destination.y - 100, destination.x, destination.y]
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
  return [from.x, from.y, connection.points.at(2), from.y, to.x, to.y]
}


export const getOffset = (placement: string, item: ItemType) => {
  switch (placement) {
    case 'top':
      return {
        x: item.width / 2,
        y: 0
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
        x: 0,
        y: item.height / 2,
      }
    default:
      return {
        x: 0,
        y: 0
      }
  }
}

export const hasIntersection = (position: PointType, item) => {
  let OFFSET = 50

  return !(
    item.x() - OFFSET > position.x ||
    item.x() + (item.width() + OFFSET) < position.x ||
    item.y() - OFFSET > position.y ||
    item.y() + (item.height() + OFFSET) < position.y
  )
}
