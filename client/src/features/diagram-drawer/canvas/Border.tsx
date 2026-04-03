import { Anchor } from '@/features/diagram-drawer/canvas/Anchor'
import { diagramHistory, uiState } from '@/features/diagram-drawer/store/models'
import { Placement } from '@/features/diagram-drawer/types'
import { getAnchorPoints } from '@/features/diagram-drawer/utils'
import { KonvaEventObject } from 'konva/lib/Node'
import { Group, Line } from 'react-konva'
import { useSnapshot } from 'valtio'

type BorderProps = {
    itemId: string
    hoveredItemId?: string
    hoveredAnchor?: Placement | null
    sourceAnchor?: Placement | null
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
    sourceAnchor,
    hoveredItemId,
    hoveredAnchor,
    onAnchorDragStart,
    onAnchorDragMove,
    onAnchorDragEnd,
}: BorderProps) => {
    const uiSnap = useSnapshot(uiState)

    const proxyItem = diagramHistory.value.items.find((i) => i.id === itemId)
    if (!proxyItem) return null

    const anchorPoints = getAnchorPoints(proxyItem)
    const padding = 7

    const borderPoints = [
        -padding,
        -padding,
        proxyItem.width + padding,
        -padding,
        proxyItem.width + padding,
        proxyItem.height + padding,
        -padding,
        proxyItem.height + padding,
        -padding,
        -padding,
    ]

    const displayAnchors =
        uiSnap.activeId === itemId ||
        hoveredItemId === itemId ||
        uiSnap.interaction !== 'dragging-item'

    const isConnecting =
        uiSnap.interaction === 'connecting' ||
        uiSnap.interaction === 'pending-connect'
    const isDragging = uiSnap.interaction === 'dragging-item'

    const anchors = anchorPoints.map(({ x, y, name }) => {
        const disabled = isDragging

        const isSourceItem = uiSnap.activeId === itemId
        const isSourceAnchor = name === sourceAnchor
        const disabledDuringConnect =
            isConnecting && isSourceItem && !isSourceAnchor

        return (
            <Anchor
                key={`${itemId}-anchor-${name}`}
                itemId={itemId}
                placement={name}
                x={x}
                y={y}
                source={sourceAnchor}
                hovered={hoveredAnchor}
                disabled={disabled || disabledDuringConnect}
                onDragStart={onAnchorDragStart}
                onDragMove={onAnchorDragMove}
                onDragEnd={onAnchorDragEnd}
            />
        )
    })

    return (
        <Group>
            {itemId ? (
                <Line
                    id={proxyItem.id}
                    x={proxyItem.x}
                    y={proxyItem.y}
                    points={borderPoints}
                    stroke="#202020"
                    strokeWidth={1.5}
                    dash={[6, 4]}
                    opacity={0.7}
                    listening={false}
                    perfectDrawEnabled={false}
                />
            ) : null}
            {displayAnchors ? anchors : null}
        </Group>
    )
}
