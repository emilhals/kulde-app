import type { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Group, Line, Rect } from 'react-konva'

const LiquidFilter = ({ item }: { item: Item | ItemPreview }) => {
    if (!item) return

    return (
        <Group>
            <Rect
                name="object"
                width={item.width}
                height={item.height}
                stroke="black"
                strokeWidth={2}
            />
            <Line
                points={[0, item.height * 0.2, item.width, item.height * 0.2]}
                stroke="black"
                strokeWidth={2}
                lineJoin="round"
                dash={[4, 3]}
            />
            <Line
                points={[0, item.height * 0.8, item.width, item.height * 0.8]}
                stroke="black"
                strokeWidth={2}
                lineJoin="round"
                dash={[4, 3]}
            />
        </Group>
    )
}

export default LiquidFilter
