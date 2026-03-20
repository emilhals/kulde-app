import { ItemType, ConnectionType } from '@/features/diagram-drawer/types'

import { getAnchorOffset } from '@/features/diagram-drawer/utils/helpers'

export const interpolateMidPoint = (start: number, end: number) => {
    return start + (end - start) / 2
}

export const getConnectionPoints = (
    from: ItemType,
    to: ItemType,
    connection: ConnectionType,
) => {
    const { offsetX: startAnchorOffsetX, offsetY: startAnchorOffsetY } =
        getAnchorOffset(from)
    const { offsetX: endAnchorOffsetX, offsetY: endAnchorOffsetY } =
        getAnchorOffset(to)

    const startPlacement = connection.offsets.from.placement
    const endPlacement = connection.offsets.to.placement

    const startX =
        from.x + connection.offsets.from.position.x + startAnchorOffsetX
    const startY =
        from.y + connection.offsets.from.position.y + startAnchorOffsetY

    const endX = to.x + connection.offsets.to.position.x + endAnchorOffsetX
    const endY = to.y + connection.offsets.to.position.y + endAnchorOffsetY

    const dy = Math.abs(startY - endY)
    const dx = Math.abs(startX - endX)

    if (dy < 5 || dx < 5) {
        return [startX, startY, endX, endY]
    }

    const midX = interpolateMidPoint(startX, endX)
    const midY = interpolateMidPoint(startY, endY)

    if (
        (startPlacement === 'Left' || startPlacement === 'Right') &&
        (endPlacement === 'Left' || endPlacement === 'Right')
    ) {
        return [startX, startY, midX, startY, midX, endY, endX, endY]
    }
    if (
        (startPlacement === 'Top' || startPlacement === 'Bottom') &&
        (endPlacement === 'Top' || endPlacement === 'Bottom')
    ) {
        return [startX, startY, startX, midY, endX, midY, endX, endY]
    }

    if (
        (startPlacement === 'Right' && endPlacement === 'Left') ||
        (startPlacement === 'Left' && endPlacement === 'Right')
    ) {
        return [startX, startY, midX, startY, midX, endY, endX, endY]
    }

    if (
        (startPlacement === 'Left' || startPlacement === 'Right') &&
        (endPlacement === 'Top' || endPlacement === 'Bottom')
    ) {
        return [startX, startY, endX, startY, endX, endY]
    }

    if (
        (startPlacement === 'Top' && endPlacement === 'Bottom') ||
        (startPlacement === 'Bottom' && endPlacement === 'Top')
    ) {
        const midY = interpolateMidPoint(startY, endY)

        return [startX, startY, startX, midY, endX, midY, endX, endY]
    }

    return [startX, startY, endX, endY]
}
