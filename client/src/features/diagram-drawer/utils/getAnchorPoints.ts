import { Item, Placement, Point } from '@/features/diagram-drawer/types'

type AnchorType = Point & {
    name: Placement
}

export const getAnchorPoints = (item: Item): AnchorType[] => {
    const anchors: AnchorType[] = []

    item.anchors.position.map((placement) => {
        const anchor = item.anchors.offsets?.[placement] ?? {
            x: 0,
            y: 0,
        }

        const offsetX = anchor.x ?? 0
        const offsetY = anchor.y ?? 0

        if (placement === 'Top') {
            anchors.push({
                name: 'Top',
                x: item.x + item.width / 2 + offsetX,
                y: item.y + offsetY,
            })
        }
        if (placement === 'Bottom') {
            anchors.push({
                name: 'Bottom',
                x: item.x + item.width / 2 + offsetX,
                y: item.y + item.height + offsetY,
            })
        }

        if (placement === 'Left') {
            anchors.push({
                name: 'Left',
                x: item.x + offsetX,
                y: item.y + item.height / 2 + offsetY,
            })
        }

        if (placement === 'Right') {
            anchors.push({
                name: 'Right',
                x: item.x + item.width + offsetX,
                y: item.y + item.height / 2 + offsetY,
            })
        }
    })

    return anchors
}
