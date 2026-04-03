import { Placement } from '@/features/diagram-drawer/types'
import { dragBounds } from '@/features/diagram-drawer/utils/konva'
import Konva from 'konva'
import { useEffect, useRef } from 'react'
import { Circle } from 'react-konva'

type PropsType = {
    itemId: string
    placement: Placement
    x: number
    y: number
    hovered?: Placement | null
    source?: Placement | null
    disabled?: boolean
    onDragStart?: (
        e: Konva.KonvaEventObject<DragEvent>,
        placement: Placement,
    ) => void
    onDragMove?: (
        e: Konva.KonvaEventObject<DragEvent>,
        placement: Placement,
    ) => void
    onDragEnd?: (
        e: Konva.KonvaEventObject<DragEvent>,
        placement: Placement,
    ) => void
}

export const Anchor = ({
    itemId,
    placement,
    x,
    y,
    source,
    hovered,
    disabled = false,
    onDragMove,
    onDragStart,
    onDragEnd,
}: PropsType) => {
    const anchorRef = useRef<Konva.Circle>(null)
    const interactedAnchorRef = useRef<Konva.Circle>(null)

    const isHovered = hovered === placement

    useEffect(() => {
        if (isHovered) {
            interactedAnchorRef.current?.to({
                radius: 7,
                duration: 0.2,
                easing: Konva.Easings.EaseIn,
            })
        } else {
            interactedAnchorRef.current?.to({
                radius: 5,
                duration: 0.2,
                easing: Konva.Easings.EaseOut,
            })
        }
    }, [isHovered, placement])

    return (
        <>
            <Circle
                id={itemId + ':' + placement?.toString()}
                x={x}
                y={y}
                radius={9}
                strokeWidth={1.5}
                stroke="#FFFFFF"
                fill={hovered === placement ? '#404040' : '#404040'}
                opacity={0.9}
                visible={hovered === placement || source === placement}
                listening={false}
                ref={interactedAnchorRef}
            />

            <Circle
                id={itemId + ':' + placement?.toString()}
                name="anchor"
                x={x}
                y={y}
                radius={4}
                strokeWidth={0.5}
                stroke="#FFFFFF"
                fill="#202020"
                draggable
                visible={!disabled}
                onMouseEnter={(e) => {
                    const container = e.target.getStage()?.container()
                    if (!container) return

                    container.style.cursor = 'crosshair'
                }}
                onPointerDown={(e) => (e.cancelBubble = true)}
                onMouseLeave={(e) => {
                    const container = e.target.getStage()?.container()
                    if (!container) return

                    container.style.cursor = 'default'
                }}
                onDragStart={(e) => onDragStart?.(e, placement)}
                onDragMove={(e) => onDragMove?.(e, placement)}
                onDragEnd={(e) => onDragEnd?.(e, placement)}
                dragBoundFunc={() => dragBounds(anchorRef)}
                perfectDrawEnabled={false}
                ref={anchorRef}
            />
        </>
    )
}
