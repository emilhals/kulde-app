import { Group, Rect, Ring } from 'react-konva'
import { ItemType } from '@/features/diagram-drawer/types'

const SightGlass = ({ item }: { item: ItemType }) => {
  if (!item) return

  return (
    <Group id={item.id}>
      <Rect
        id={item.id}
        name="object"
        width={item.width}
        height={item.height}
        stroke="black"
        strokeWidth={2}
      />
      <Ring
        id={item.id}
        name="object"
        x={item.width / 2}
        y={item.height / 2}
        innerRadius={5}
        outerRadius={8}
        strokeWidth={2}
        stroke="black"
      />
    </Group>
  )
}

export default SightGlass
