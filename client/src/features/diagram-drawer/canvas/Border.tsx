import { KonvaEventObject } from 'konva/lib/Node'
import { Group, Line } from 'react-konva'

import { Anchor } from '@/features/diagram-drawer/canvas/Anchor'
import { diagramHistory, uiState } from '@/features/diagram-drawer/store/models'
import { ItemType, Placement, PointType } from '@/features/diagram-drawer/types'
import { useSnapshot } from 'valtio'

export type AnchorType = PointType & {
    name: Placement
}

const getAnchorOffset = (
    item: ItemType,
): { offsetX: number; offsetY: number } => {
    if (!item.anchors.offset) return { offsetX: 0, offsetY: 0 }

    const offsetX = 0
    let offsetY = 0

    switch (item.anchors.offset.y) {
        case 'Bottom':
            offsetY = item.height / 2
    }

    return { offsetX, offsetY }
}

const getAnchorPoints = (item: ItemType): AnchorType[] => {
    const anchors: AnchorType[] = []

    const { offsetX, offsetY } = getAnchorOffset(item)

    item.anchors.position.map((placement) => {
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

type BorderProps = {
    itemId: string
    hoveredItemId?: string
    hoveredAnchor?: Placement | null
    active?: Placement | null
    onAnchorDragStart?: (
        e: KonvaEventObject<DragEvent>,
        placement: Placement,
    ) => void
    onAnchorDragMove?: (
        e: KonvaEventObject<DragEvent>,
        attachment: Placement,
    ) => void
    onAnchorDragEnd?: (
        e: KonvaEventObject<DragEvent>,
        placement: Placement,
    ) => void
}

export const Border = ({
    itemId,
    hoveredItemId,
    hoveredAnchor,
    active,
    onAnchorDragStart,
    onAnchorDragMove,
    onAnchorDragEnd,
}: BorderProps) => {
    const proxyItem = diagramHistory.value.items.find((i) => i.id === itemId)
    if (!proxyItem) return null

    const uiSnap = useSnapshot(uiState)

    const anchorPoints = getAnchorPoints(proxyItem)
    const borderPoints = [
        0,
        0,
        proxyItem.width,
        0,
        proxyItem.width,
        proxyItem.height,
        0,
        proxyItem.height,
        0,
        0,
    ]

    const displayAnchors =
        uiSnap.activeId === itemId || hoveredItemId === itemId

    const anchors = anchorPoints.map(({ x, y, name }) => (
        <Anchor
            key={`${itemId}-anchor-${name}`}
            itemId={itemId}
            placement={name}
            x={x}
            y={y}
            active={active}
            hovered={hoveredAnchor}
            onDragStart={onAnchorDragStart}
            onDragMove={onAnchorDragMove}
            onDragEnd={onAnchorDragEnd}
        />
    ))

    return (
        <Group>
            {itemId ? (
                <Line
                    id={proxyItem.id}
                    x={proxyItem.x}
                    y={proxyItem.y}
                    points={borderPoints}
                    stroke="#7C3AED"
                    strokeWidth={2}
                    listening={false}
                    perfectDrawEnabled={false}
                />
            ) : null}
            {displayAnchors ? anchors : null}
        </Group>
    )
}
