import { useEffect, useRef, useState } from 'react'

import Konva from 'konva'
import { Line } from 'react-konva'
import { Node, NodeConfig } from 'konva/lib/Node'

import { PointType } from '@/features/diagram-drawer/types'
import { createConnectionPoints } from '@/features/diagram-drawer/utils/createConnectionPoints'

export const useConnectionPreview = () => {
    const lineRef = useRef<Konva.Line>(null)

    const [connectionPreview, setConnectionPreview] =
        useState<React.ReactNode>()

    useEffect(() => {
        if (!lineRef.current) return

        const anim = new Konva.Animation((frame) => {
            if (!frame || !lineRef.current) return

            lineRef.current.dashOffset(-(frame.time / 30))
        }, lineRef.current.getLayer())

        anim.start()

        return () => {
            anim.stop()
        }
    }, [connectionPreview])

    const setInitialPreview = (position: PointType) => {
        setConnectionPreview(
            <Line
                x={0}
                y={0}
                points={[position.x, position.y, 0, 0]}
                strokeWidth={4}
                stroke="#2d9cdb"
                lineJoin="round"
                lineCap="round"
                perfectDrawEnabled={false}
                shadowBlur={1}
                shadowColor="#ffffff"
                shadowOpacity={0.5}
                listening={false}
                ref={lineRef}
            />,
        )
    }

    const updatePreview = (
        startPos: PointType,
        mousePosition: PointType,
        draggedFromAnchor: Node<NodeConfig>,
        hoveredAnchor: Node<NodeConfig>,
    ) => {
        setConnectionPreview(
            <Line
                x={0}
                y={0}
                points={createConnectionPoints(
                    startPos,
                    mousePosition,
                    draggedFromAnchor,
                    hoveredAnchor,
                )}
                strokeWidth={2.5}
                stroke="#7C3AED"
                lineJoin="round"
                dash={[6, 4]}
                lineCap="round"
                listening={false}
                perfectDrawEnabled={false}
                shadowBlur={10}
                shadowOffsetY={1}
                shadowOffsetX={1}
                shadowColor="#42AEEC"
                shadowOpacity={0.5}
                ref={lineRef}
            />,
        )
    }

    const clearPreview = () => setConnectionPreview(null)

    return {
        connectionPreview,
        setInitialPreview,
        updatePreview,
        clearPreview,
    }
}
