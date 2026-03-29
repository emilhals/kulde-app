import { PointType } from '@/features/diagram-drawer/types'
import Konva from 'konva'

export const hasIntersection = (position: PointType, item: Konva.Node) => {
    const OFFSET = 30

    return !(
        item.x() - OFFSET > position.x ||
        item.x() + (item.width() + OFFSET) < position.x ||
        item.y() - OFFSET > position.y ||
        item.y() + (item.height() + OFFSET) < position.y
    )
}
