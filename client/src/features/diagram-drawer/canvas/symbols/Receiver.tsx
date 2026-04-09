import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Group, Line, Rect } from 'react-konva'

const Receiver = ({ item }: { item: Item | ItemPreview }) => {
    if (!item) return null

    const w = item.width
    const h = item.height
    const rx = w / 2
    const capH = h * 0.15

    const itemId = 'id' in item ? item.id : ''

    return (
        <Group id={itemId}>
            {/* Main body */}
            <Rect
                name="object"
                x={0}
                y={capH}
                width={w}
                height={h - capH * 2}
                stroke="black"
                strokeWidth={2}
            />
            {/* Top cap */}
            <Line
                name="object"
                points={[0, capH, rx * 0.4, 0, rx * 1.6, 0, w, capH]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
                lineJoin="round"
            />
            {/* Bottom cap */}
            <Line
                name="object"
                points={[0, h - capH, rx * 0.4, h, rx * 1.6, h, w, h - capH]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
                lineJoin="round"
            />
            {/* Liquid level line */}
            <Line
                points={[w * 0.1, h * 0.65, w * 0.9, h * 0.65]}
                stroke="black"
                strokeWidth={1}
                dash={[4, 3]}
            />
        </Group>
    )
}

export default Receiver
