import { ItemType, Placement, PointType } from '@/features/diagram-drawer/types'

export const computeT = (
    placement: Placement,
    position: PointType,
    item: ItemType,
) => {
    switch (placement) {
        case 'Top':
        case 'Bottom':
            return (position.x - item.x) / item.width

        case 'Left':
        case 'Right':
            return (position.y - item.y) / item.height
    }
}
