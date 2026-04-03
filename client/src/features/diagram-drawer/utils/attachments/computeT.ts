import { Item, Placement, Point } from '@/features/diagram-drawer/types'

export const computeT = (
    placement: Placement,
    anchorPosition: Point,
    item: Item,
): number => {
    if (placement === 'Left' || placement === 'Right') {
        return (anchorPosition.y - item.y) / item.height
    } else {
        return (anchorPosition.x - item.x) / item.width
    }
}
