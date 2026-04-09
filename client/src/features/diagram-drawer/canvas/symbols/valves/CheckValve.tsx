import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Group, Line, RegularPolygon } from 'react-konva'

// Standard P&ID check valve: arrow/triangle with a bar indicating flow direction
const CheckValve = ({ item }: { item: Item | ItemPreview }) => {
    if (!item) return null

    const w = item.width
    const h = item.height
    const cx = w / 2
    const cy = h / 2
    const triR = Math.min(w * 0.38, h * 0.45)

    const itemId = 'id' in item ? item.id : ''

    return (
        <Group id={itemId}>
            {/* Triangle pointing right — flow direction */}
            <RegularPolygon
                name="object"
                sides={3}
                radius={triR}
                rotation={90}
                x={cx - triR * 0.2}
                y={cy}
                stroke="black"
                strokeWidth={2}
                fill="white"
            />
            {/* Stop bar on the right side of triangle */}
            <Line
                name="object"
                points={[
                    cx - triR * 0.2 + triR,
                    cy - triR * 0.9,
                    cx - triR * 0.2 + triR,
                    cy + triR * 0.9,
                ]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            {/* Inlet pipe left */}
            <Line
                points={[0, cy, cx - triR * 0.2 - triR, cy]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            {/* Outlet pipe right */}
            <Line
                points={[cx - triR * 0.2 + triR, cy, w, cy]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
        </Group>
    )
}

export default CheckValve
