import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Circle, Group, Line, Text } from 'react-konva'

const Thermometer = ({ item }: { item: Item | ItemPreview }) => {
    if (!item) return null

    const w = item.width
    const h = item.height
    const cx = w / 2
    const radius = Math.min(w, h * 0.5) / 2 - 2
    const cy = radius + 2

    return (
        <Group>
            {/* Gauge face circle */}
            <Circle
                name="object"
                x={cx}
                y={cy}
                radius={radius}
                stroke="black"
                strokeWidth={2}
                fill="white"
            />
            {/* T label */}
            <Text
                text="T"
                fontSize={Math.max(radius * 0.65, 10)}
                fontFamily="Inter"
                fill="black"
                x={cx - radius * 0.22}
                y={cy - radius * 0.4}
            />
            {/* Stem down */}
            <Line
                points={[cx, cy + radius, cx, h]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
        </Group>
    )
}

export default Thermometer
