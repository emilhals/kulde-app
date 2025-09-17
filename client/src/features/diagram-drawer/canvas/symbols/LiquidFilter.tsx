import { Group, Rect, Line } from 'react-konva'
import { ItemType } from '@/features/diagram-drawer/types'

const LiquidFilter = ({ item }: { item: ItemType }) => {
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
