import { ItemType, ConnectionType } from '@/features/diagram-drawer/types'

import { getAnchorOffset } from '@/features/diagram-drawer/utils/helpers'

export const getConnectionPoints = (
  from: ItemType,
  to: ItemType,
  connection: ConnectionType,
) => {
  const { offsetX: startAnchorOffsetX, offsetY: startAnchorOffsetY } =
    getAnchorOffset(from)
  const { offsetX: endAnchorOffsetX, offsetY: endAnchorOffsetY } =
    getAnchorOffset(to)

  const dx = Math.abs(from.x + startAnchorOffsetX - to.x + endAnchorOffsetX)
  const dy = Math.abs(from.y + startAnchorOffsetY - to.y + endAnchorOffsetY)

  const y = from.y + startAnchorOffsetY - to.y + endAnchorOffsetY
  const x = from.x + startAnchorOffsetX - to.x + endAnchorOffsetX

  const startX =
    from.x + connection.offsets.from.position.x + startAnchorOffsetX
  const startY =
    from.y + connection.offsets.from.position.y + startAnchorOffsetY

  const endX = to.x + connection.offsets.to.position.x + endAnchorOffsetX
  const endY = to.y + connection.offsets.to.position.y + endAnchorOffsetY
  /*
  console.log('y: ', y)
  console.log('dx: ', dx)
  console.log('dy: ', dy)
  console.log('x: ', x)
*/
  /* if the shapes are on about the same Y axis */
  if (dy <= 50) {
    console.log('same line')
    return [startX, startY, endX, endY]
  }

  if (x > 0) {
    return [startX, startY, startX / 2, startY, startX / 2, endY, endX, endY]
  } else {
    return [startX, startY, endX / 2, startY, endX / 2, endY, endX, endY]
  }

  /*
      return [
        to.x - from.width,
        to.y,
        to.x / 2,
        to.y,
        from.x / 2,
        from.y,
        from.x - from.width,
        from.y,
      ]*/
}
