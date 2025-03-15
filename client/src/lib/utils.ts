import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { ItemType, PointType } from '@/common/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




/*
 * For the connecting related components
 */
export const createConnectionPoints = (source: PointType, anchor: string, destination: PointType) => {
  let OFFSET = 200

  let nullPoint: PointType = {
    x: 0,
    y: 0
  }

  let midPoint: PointType = {
    x: 0,
    y: 0
  }

  if ((destination.x - nullPoint.x) < OFFSET) {
    midPoint.x = destination.x
    midPoint.y = destination.y
  } else {
    midPoint.x = destination.x
    midPoint.y = 0
  }

  return [nullPoint.x, nullPoint.y, midPoint.x, midPoint.y, destination.x, destination.y]
}

export const hasIntersection = (position: PointType, item: ItemType) => {
  return !(
    item.x > position.x ||
    item.x + item.width < position.x ||
    item.y > position.y ||
    item.y + item.height < position.y
  )
}
