import { Circle, Group, Text } from 'react-konva'
import { ItemType } from '@/features/diagram-drawer/types'

const MeasurePoint = ({ item }: { item: ItemType }) => {
  const centerX = item.width / 2
  const centerY = item.height / 2

  const radius = Math.max(item.height, item.width) / 2

  const needle = item.component.search('measurepoint_t')
  let label = ''

  if (needle === -1) {
    label = 'P'
  } else {
    label = 'T'
  }

  return (
    <Group>
      <Text
        name="object"
        id={item.id}
        text={label}
        fontSize={16}
        fontFamily={'Inter'}
        x={centerX}
        y={centerY}
        align="center"
        offsetX={5}
        offsetY={7}
      />
      <Circle
        id={item.id}
        name="object"
        x={centerX}
        y={centerY}
        radius={radius}
        stroke="black"
        strokeWidth={2}
      />
    </Group>
  )
}

export default MeasurePoint
