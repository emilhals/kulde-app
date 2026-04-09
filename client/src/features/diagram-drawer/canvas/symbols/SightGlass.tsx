import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Group, Rect, Ring } from 'react-konva'

const SightGlass = ({ item }: { item: Item | ItemPreview }) => {
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
            <Ring
                name="object"
                x={item.width / 2}
                y={item.height / 2}
                innerRadius={3}
                outerRadius={5}
                strokeWidth={1}
                stroke="black"
            />
        </Group>
    )
}

export default SightGlass
