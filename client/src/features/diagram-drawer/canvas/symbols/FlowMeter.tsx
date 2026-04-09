import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Circle, Group, Line, Text } from 'react-konva'

const FlowMeter = ({ item }: { item: Item | ItemPreview }) => {
    if (!item) return null

    const w = item.width
    const h = item.height
    const cx = w / 2
    const cy = h / 2
    const radius = Math.min(w, h) / 2 - 2

    const itemId = 'id' in item ? item.id : ''

    return (
        <Group id={itemId}>
            {/* Instrument circle */}
            <Circle
                name="object"
                x={cx}
                y={cy}
                radius={radius}
                stroke="black"
                strokeWidth={2}
                fill="white"
            />
            {/* FI label — flow indicator */}
            <Text
                text="FI"
                fontSize={Math.max(radius * 0.5, 9)}
                fontFamily="Inter"
                fill="black"
                x={cx - radius * 0.3}
                y={cy - radius * 0.55}
            />
            {/* Flow arrow inside */}
            <Line
                points={[
                    cx - radius * 0.45,
                    cy + radius * 0.1,
                    cx + radius * 0.2,
                    cy + radius * 0.1,
                ]}
                stroke="black"
                strokeWidth={1.5}
                lineCap="round"
            />
            <Line
                points={[
                    cx + radius * 0.05,
                    cy - radius * 0.15,
                    cx + radius * 0.35,
                    cy + radius * 0.1,
                    cx + radius * 0.05,
                    cy + radius * 0.35,
                ]}
                stroke="black"
                strokeWidth={1.5}
                lineCap="round"
                lineJoin="round"
            />
            {/* Inline pipe connections */}
            <Line
                points={[0, cy, cx - radius, cy]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            <Line
                points={[cx + radius, cy, w, cy]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
        </Group>
    )
}

export default FlowMeter
