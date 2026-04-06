import { Attachment, ItemAttachment } from '@/features/diagram-drawer/types'
import { getAttachmentPosition } from '@/features/diagram-drawer/utils/attachments'
import { createConnectionPoints } from '@/features/diagram-drawer/utils/connections'
import Konva from 'konva'
import { useEffect, useRef, useState } from 'react'
import { Line } from 'react-konva'

export const useConnectionPreview = () => {
    const lineRef = useRef<Konva.Line>(null)

    const [connectionPreview, setConnectionPreview] =
        useState<React.ReactNode>()

    const shouldAnimate = useRef<boolean>(true)

    useEffect(() => {
        if (!lineRef.current) return

        if (shouldAnimate) {
            const anim = new Konva.Animation((frame) => {
                if (!frame || !lineRef.current) return

                lineRef.current.dashOffset(-(frame.time / 30))
            }, lineRef.current.getLayer())

            anim.start()
            return () => {
                anim.stop()
            }
        }
    }, [connectionPreview, shouldAnimate])

    const updatePreview = (from: ItemAttachment, to: Attachment) => {
        const fromPosition = getAttachmentPosition(from)
        const toPosition = getAttachmentPosition(to)

        if (!fromPosition || !toPosition) return

        const fromPlacement = from.placement
        const toPlacement = to.type === 'item' ? to.placement : undefined

        setConnectionPreview(
            <Line
                x={0}
                y={0}
                points={createConnectionPoints(
                    fromPosition,
                    toPosition,
                    fromPlacement,
                    toPlacement,
                )}
                strokeWidth={2.5}
                stroke="#374151"
                opacity={0.7}
                lineJoin="round"
                dash={[6, 4]}
                lineCap="round"
                listening={false}
                perfectDrawEnabled={false}
                ref={lineRef}
            />,
        )
    }

    const clearPreview = () => setConnectionPreview(null)

    return {
        connectionPreview,
        updatePreview,
        clearPreview,
    }
}
