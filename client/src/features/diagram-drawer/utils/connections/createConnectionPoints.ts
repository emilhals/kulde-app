import { Placement, Point } from '@/features/diagram-drawer/types'
import { interpolateMidPoint } from '@/features/diagram-drawer/utils/connections'

export const createConnectionPoints = (
    start: Point,
    end: Point,
    startAnchorPlacement: Placement,
    endAnchorPlacement?: Placement,
): number[] => {
    const source = startAnchorPlacement
    const target = endAnchorPlacement

    const horizontalFirst =
        source === 'Left' || source === 'Right'
            ? true
            : source === 'Top' || source === 'Bottom'
              ? false
              : Math.abs(end.x) > Math.abs(end.y)

    if (!target) {
        return [start.x, start.y, end.x, end.y]
    }

    const midX = interpolateMidPoint(start.x, end.x)
    //const midY = interpolateMidPoint(start.y, end.y)

    if (horizontalFirst) {
        return [start.x, start.y, midX, start.y, midX, end.y, end.x, end.y]
    } else {
        return [start.x, start.y, start.x, end.y, end.x, end.y]
    }
}
