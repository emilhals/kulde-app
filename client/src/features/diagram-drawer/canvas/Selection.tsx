import { Box } from '@/features/diagram-drawer/types'
import Konva from 'konva'
import { useRef } from 'react'
import { Group, Rect } from 'react-konva'

export const Selection = ({ selection }: { selection: Box | null }) => {
    const selectRef = useRef<Konva.Rect>(null)

    if (!selection) return null

    const x = Math.min(selection.start.x, selection.end.x)
    const y = Math.min(selection.start.y, selection.end.y)
    const width = Math.abs(selection.start.x - selection.end.x)
    const height = Math.abs(selection.start.y - selection.end.y)

    return (
        <Group>
            <Rect
                ref={selectRef}
                x={x}
                y={y}
                width={width}
                height={height}
                listening={false}
                fill="#202020"
                stroke="#7C3AED"
                strokeWidth={1}
                dash={[4, 4]}
                opacity={0.1}
                name="select"
            />
        </Group>
    )
}
