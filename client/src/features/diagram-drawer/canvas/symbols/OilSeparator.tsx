import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Arc, Circle, Group, Line, Rect } from 'react-konva'

const OilSeparator = ({ item }: { item: Item | ItemPreview }) => {
    if (!item) return null

    const w = item.width
    const h = item.height
    const rx = w / 2

    return (
        <Group>
            {/* Main body */}
            <Rect
                name="object"
                x={0}
                y={rx}
                width={w}
                height={h - 2 * rx}
                stroke="black"
                strokeWidth={2}
            />
            {/* Top dome */}
            <Arc
                name="object"
                x={rx}
                y={rx}
                innerRadius={0}
                outerRadius={rx}
                angle={180}
                rotation={180}
                stroke="black"
                strokeWidth={2}
                fill="white"
            />
            {/* Bottom dome */}
            <Arc
                name="object"
                x={rx}
                y={h - rx}
                innerRadius={0}
                outerRadius={rx}
                angle={180}
                rotation={0}
                stroke="black"
                strokeWidth={2}
                fill="white"
            />
            {/* Inlet pipe - left side */}
            <Line
                points={[-w * 0.15, h * 0.35, 0, h * 0.35]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            {/* Gas outlet pipe - top */}
            <Line
                points={[rx, 0, rx, -h * 0.08]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            {/* Oil drain - bottom */}
            <Line
                points={[rx, h, rx, h + h * 0.08]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            {/* Internal mesh/baffle lines */}
            <Line
                points={[w * 0.15, h * 0.3, w * 0.85, h * 0.3]}
                stroke="black"
                strokeWidth={1}
                dash={[3, 2]}
            />
            <Line
                points={[w * 0.15, h * 0.38, w * 0.85, h * 0.38]}
                stroke="black"
                strokeWidth={1}
                dash={[3, 2]}
            />
            {/* Small circle indicating oil level */}
            <Circle
                x={rx}
                y={h * 0.65}
                radius={w * 0.08}
                stroke="black"
                strokeWidth={1.5}
            />
        </Group>
    )
}

export default OilSeparator
