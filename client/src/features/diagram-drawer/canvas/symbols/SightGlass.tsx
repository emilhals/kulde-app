import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Group, Rect, Ring } from 'react-konva'

const SightGlass = ({
  item,
  strokeColor,
}: {
  item: Item | ItemPreview
  strokeColor: string
}) => {
  return (
    <Group>
      <Rect
        name="object"
        width={item.width}
        height={item.height}
        stroke={strokeColor}
        strokeWidth={2}
      />
      <Ring
        name="object"
        x={item.width / 2}
        y={item.height / 2}
        innerRadius={3}
        outerRadius={5}
        strokeWidth={1}
        stroke={strokeColor}
      />
    </Group>
  )
}

export default SightGlass
