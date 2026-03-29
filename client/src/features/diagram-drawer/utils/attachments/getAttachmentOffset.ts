import { Placement, ItemType } from '@/features/diagram-drawer/types'

export const getAttachmentOffset = (placement: Placement, item: ItemType) => {
    switch (placement) {
        case 'Top':
            return {
                x: item.width / 2,
                y: 0,
            }

        case 'Bottom':
            return {
                x: item.width / 2,
                y: item.height,
            }

        case 'Right':
            return {
                x: item.width,
                y: item.height / 2,
            }

        case 'Left':
            return {
                x: 0,
                y: item.height / 2,
            }
        default:
            return {
                x: 0,
                y: 0,
            }
    }
}
