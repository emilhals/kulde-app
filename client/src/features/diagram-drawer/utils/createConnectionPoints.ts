import Konva from 'konva'
import { PointType } from '@/features/diagram-drawer/types'
import { Node, NodeConfig } from 'konva/lib/Node'

export const createConnectionPoints = (
  destination: PointType,
  sourceAnchor: Node<NodeConfig>,
  destinationAnchor: Node<NodeConfig>,
): number[] => {
  const OFFSET = 200

  const nullPoint: PointType = {
    x: 0,
    y: 0,
  }

  const midPoint: PointType = {
    x: 0,
    y: 0,
  }

  if (destinationAnchor) {
    if (sourceAnchor.x() !== destinationAnchor.x()) {
      /* from Right to ... */
      if (sourceAnchor.id() === 'Right' && destinationAnchor.id() === 'Left') {
        return [
          destination.x / 2,
          0,
          destination.x / 2,
          destination.y,
          destination.x,
          destination.y,
        ]
      }
      if (
        sourceAnchor.id() === 'Right' &&
        destinationAnchor.id() === 'Bottom'
      ) {
        return [destination.x, 0, destination.x, destination.y]
      }
      if (sourceAnchor.id() === 'Right' && destinationAnchor.id() === 'right') {
        return [
          destination.x + OFFSET,
          0,
          destination.x + OFFSET,
          destination.y,
          destination.x,
          destination.y,
        ]
      }
      if (sourceAnchor.id() === 'Right' && destinationAnchor.id() === 'Top') {
        return [
          destination.x / 2,
          0,
          destination.x / 2,
          destination.y - 100,
          destination.x,
          destination.y - 100,
          destination.x,
          destination.y,
        ]
      }

      /* from Left to ... */
      if (sourceAnchor.id() === 'Left' && destinationAnchor.id() === 'Top') {
        return [
          0,
          0,
          destination.x,
          0,
          destination.x,
          destination.y - destination.y / 2,
          destination.x,
          destination.y,
        ]
      }

      if (sourceAnchor.id() === 'Left' && destinationAnchor.id() === 'Bottom') {
        return [
          0,
          0,
          destination.x / 2,
          0,
          destination.x / 2,
          destination.y + OFFSET,
          destination.x,
          destination.y + OFFSET,
          destination.x,
          destination.y,
        ]
      }

      if (sourceAnchor.id() === 'Left' && destinationAnchor.id() === 'Right') {
        return [
          0,
          0,
          destination.x / 2,
          0,
          destination.x / 2,
          destination.y,
          destination.x,
          destination.y,
        ]
      }

      if (sourceAnchor.id() === 'Left' && destinationAnchor.id() === 'left') {
        return [
          0,
          0,
          destination.x + destination.x / 2,
          0,
          destination.x + destination.x / 2,
          destination.y,
          destination.x,
          destination.y,
        ]
      }

      /* from Top to ... */
      if (sourceAnchor.id() === 'Top' && destinationAnchor.id() === 'Left') {
        return [0, 0, 0, destination.y, destination.x, destination.y]
      }
      if (sourceAnchor.id() === 'Top' && destinationAnchor.id() === 'Bottom') {
        console.log('ade')
        return [
          0,
          0,
          destination.x,
          destination.y,
          destination.x,
          destination.y,
        ]
      }
      if (sourceAnchor.id() === 'Top' && destinationAnchor.id() === 'Right') {
        return [
          0,
          destination.y,
          destination.x,
          destination.y,
          destination.x,
          destination.y,
        ]
      }
      if (sourceAnchor.id() === 'Top' && destinationAnchor.id() === 'top') {
        return [
          0,
          destination.y - 100,
          destination.x,
          destination.y - 100,
          destination.x,
          destination.y - 100,
          destination.x,
          destination.y,
        ]
      }

      /* from Bottom to ... */
      if (sourceAnchor.id() === 'Bottom' && destinationAnchor.id() === 'Left') {
        return [
          0,
          destination.y,
          destination.x,
          destination.y,
          destination.x,
          destination.y,
          destination.x,
          destination.y,
        ]
      }
    }
  } else {
    if (destination.x - nullPoint.x > OFFSET) {
      return [
        nullPoint.x,
        nullPoint.y,
        destination.x / 2,
        0,
        destination.x / 2,
        destination.y,
        destination.x,
        destination.y,
      ]
    }
    return [
      nullPoint.x,
      nullPoint.y,
      midPoint.x,
      midPoint.y,
      destination.x,
      destination.y,
    ]
  }

  return []
}
