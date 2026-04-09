import type { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Circle, Group, Line, Rect, RegularPolygon, Text } from 'react-konva'

const TEV = ({ item }: { item: Item | ItemPreview }) => {
    if (!item) return null

    const itemId = 'id' in item ? item.id : ''

    return (
        <Group id={itemId}>
            <Rect name="object" width={item.width} height={item.height} />

            <Line
                points={[
                    item.width * 0.85 - 12,
                    0,
                    item.width * 0.2,
                    0,
                    item.width * 0.2,
                    item.height - 16,
                ]}
                stroke="black"
                strokeWidth={2}
            />

            {/* Circle on top */}
            <Circle
                x={item.width * 0.85 - 12}
                y={12}
                radius={12}
                stroke="black"
                strokeWidth={2}
            />

            {/* Line between the two circles */}
            <Line
                points={[
                    item.width * 0.85,
                    item.height / 2 - 16,
                    item.width * 0.85,
                    12,
                ]}
                stroke="black"
                strokeWidth={2}
            />

            {/* Circle with label */}
            <Circle
                x={item.width * 0.85}
                y={item.height / 2}
                radius={16}
                stroke="black"
                strokeWidth={2}
            />

            <Text
                text="TC"
                fontSize={16}
                fontFamily="Inter"
                fill="black"
                x={item.width * 0.85 - 11}
                y={item.height / 2 - 8}
            />

            {/* Line that goes from circle above to the bottom */}
            <Line
                points={[
                    item.width * 0.85,
                    item.height / 2 + 16,
                    item.width * 0.85,
                    item.height,
                ]}
                stroke="black"
                strokeWidth={2}
            />

            {/* Circle on bottom */}
            <Circle
                x={item.width * 0.2}
                y={item.height - 8}
                radius={8}
                stroke="black"
                strokeWidth={2}
            />

            {/* Valve */}
            <RegularPolygon
                sides={3}
                radius={9}
                rotation={90}
                x={item.width * 0.85 - 9}
                y={item.height}
                stroke="black"
                strokeWidth={2}
            />

            <RegularPolygon
                sides={3}
                radius={9}
                rotation={-90}
                x={item.width * 0.85 + 9}
                y={item.height}
                stroke="black"
                strokeWidth={2}
            />

            <RegularPolygon
                sides={3}
                radius={6}
                rotation={0}
                x={item.width * 0.85}
                y={item.height + 8}
                stroke="black"
                strokeWidth={2}
            />

            {/* Bottom line */}
            <Line
                points={[0, item.height, item.width * 0.85 - 13, item.height]}
                stroke="black"
                strokeWidth={2}
            />
        </Group>
    )
}

export default TEV
