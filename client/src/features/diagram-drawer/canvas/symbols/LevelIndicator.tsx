import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Group, Line, Rect } from 'react-konva'

const LevelIndicator = ({ item }: { item: Item | ItemPreview }) => {
    if (!item) return null

    const w = item.width
    const h = item.height
    const cx = w / 2
    const colW = w * 0.35
    const colX = cx - colW / 2
    const levelFill = 0.55 // 55% full

    const itemId = 'id' in item ? item.id : ''

    return (
        <Group id={itemId}>
            {/* Outer column body */}
            <Rect
                name="object"
                x={colX}
                y={0}
                width={colW}
                height={h}
                stroke="black"
                strokeWidth={2}
                fill="white"
            />
            {/* Liquid level fill */}
            <Rect
                x={colX + 2}
                y={h * (1 - levelFill)}
                width={colW - 4}
                height={h * levelFill - 2}
                fill="#D9D9D9"
            />
            {/* Level line */}
            <Line
                points={[
                    colX,
                    h * (1 - levelFill),
                    colX + colW,
                    h * (1 - levelFill),
                ]}
                stroke="black"
                strokeWidth={1.5}
                lineCap="round"
            />
            {/* Top connection nub */}
            <Line
                points={[cx, 0, cx, -h * 0.06]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            {/* Bottom connection nub */}
            <Line
                points={[cx, h, cx, h + h * 0.06]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            {/* Tick marks on the side */}
            {[0.25, 0.5, 0.75].map((t, i) => (
                <Line
                    key={i}
                    points={[colX + colW, h * t, colX + colW + w * 0.15, h * t]}
                    stroke="black"
                    strokeWidth={1}
                    lineCap="round"
                />
            ))}
        </Group>
    )
}

export default LevelIndicator
