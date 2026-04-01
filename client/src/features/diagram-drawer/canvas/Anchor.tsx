import Konva from 'konva'
import { useEffect, useRef } from 'react'
import { Circle } from 'react-konva'

import { Placement } from '@/features/diagram-drawer/types'
import { dragBounds } from '@/features/diagram-drawer/utils/konva'

type PropsType = {
    itemId: string
    placement: Placement
    x: number
    y: number
    hovered?: Placement | null
    active?: Placement | null
    onDragStart: (
        e: Konva.KonvaEventObject<DragEvent>,
        placement: Placement,
    ) => void
    onDragMove: (
        e: Konva.KonvaEventObject<DragEvent>,
        placement: Placement,
    ) => void
    onDragEnd: (
        e: Konva.KonvaEventObject<DragEvent>,
        placement: Placement,
    ) => void
}

export const Anchor = ({
    itemId,
    placement,
    x,
    y,
    active,
    hovered,
    onDragMove,
    onDragStart,
    onDragEnd,
}: PropsType) => {
    const anchorRef = useRef<Konva.Circle>(null)
    const hoveredAnchorRef = useRef<Konva.Circle>(null)

    useEffect(() => {
        const isHovered = hovered === placement
        const isActive = active === placement

        let anim: Konva.Animation | null = null

        if (isActive && hoveredAnchorRef.current) {
            const period = 1200

            anim = new Konva.Animation((frame) => {
                if (!frame) return

                const t = Math.sin((frame.time * 2 * Math.PI) / period)
                const scale = 1 + 0.08 * t
                const opacity = 0.5 + 0.2 * Math.sin(t)

                hoveredAnchorRef.current?.scale({ x: scale, y: scale })
                hoveredAnchorRef.current?.opacity(opacity)
            }, hoveredAnchorRef.current?.getLayer())

            anim.start()
        } else {
            hoveredAnchorRef.current?.scale({ x: 1, y: 1 })
        }

        if (isActive) {
            hoveredAnchorRef.current?.to({
                radius: 10,
                duration: 0.2,
                easing: Konva.Easings.EaseOut,
            })
        } else if (isHovered) {
            hoveredAnchorRef.current?.to({
                radius: 10,
                duration: 0.2,
                easing: Konva.Easings.EaseIn,
            })
        } else {
            hoveredAnchorRef.current?.to({
                radius: 5,
                duration: 0.2,
                easing: Konva.Easings.EaseOut,
            })
        }

        return () => {
            anim?.stop()
        }
    }, [hovered, active, placement])

    return (
        <>
            <Circle
                id={itemId + ':' + placement?.toString()}
                x={x}
                y={y}
                radius={9}
                strokeWidth={1.5}
                stroke="#FFFFFF"
                fill={hovered === placement ? '#A78BFA' : '#5B21B6'}
                opacity={0.9}
                visible={hovered === placement || active === placement}
                listening={false}
                ref={hoveredAnchorRef}
            />

            <Circle
                id={itemId + ':' + placement?.toString()}
                name="anchor"
                x={x}
                y={y}
                radius={6}
                strokeWidth={1.5}
                stroke="#FFFFFF"
                fill="#A78BFA"
                draggable
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
                onDragStart={(e) => onDragStart(e, placement)}
                onDragMove={(e) => onDragMove(e, placement)}
                onDragEnd={(e) => onDragEnd(e, placement)}
                dragBoundFunc={() => dragBounds(anchorRef)}
                perfectDrawEnabled={false}
                listening={true}
                ref={anchorRef}
            />
        </>
    )
}
