import { Group, Rect, Ring } from 'react-konva'
import { ItemType } from '@/features/diagram-drawer/types'

const SightGlass = ({ item }: { item: ItemType }) => {
  if (!item) return

  const centerX = item.x + item.width / 2
  const centerY = item.y + item.height / 2

  return (
    <Group>
      <Rect
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        stroke="black"
        strokeWidth={2}
      />
      <Ring
        x={centerX}
        y={centerY}
        innerRadius={5}
        outerRadius={8}
        strokeWidth={2}
        stroke="black"
      />
    </Group>
  )
}

export default SightGlass
