import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Group, Line, RegularPolygon } from 'react-konva'

const BallValve = ({ item }: { item: Item | ItemPreview }) => {
    if (!item) return null

    const w = item.width
    const h = item.height
    const cx = w / 2
    const cy = h / 2
    const triR = Math.min(w * 0.38, h * 0.45)

    const itemId = 'id' in item ? item.id : ''

    return (
        <Group id={itemId}>
            {/* Left triangle pointing right */}
            <RegularPolygon
                name="object"
                sides={3}
                radius={triR}
                rotation={90}
                x={cx - triR}
                y={cy}
                stroke="black"
                strokeWidth={2}
                fill="black"
            />
            {/* Right triangle pointing left */}
            <RegularPolygon
                name="object"
                sides={3}
                radius={triR}
                rotation={-90}
                x={cx + triR}
                y={cy}
                stroke="black"
                strokeWidth={2}
                fill="black"
            />
            {/* Stem line upward from center */}
            <Line
                points={[cx, cy - triR * 0.1, cx, cy - triR * 1.1]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            {/* Handle bar at top */}
            <Line
                points={[
                    cx - triR * 0.6,
                    cy - triR * 1.1,
                    cx + triR * 0.6,
                    cy - triR * 1.1,
                ]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            {/* Inlet pipe left */}
            <Line
                points={[0, cy, cx - triR * 2, cy]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            {/* Outlet pipe right */}
            <Line
                points={[cx + triR * 2, cy, w, cy]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
        </Group>
    )
}

export default BallValve
