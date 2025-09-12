import { Group, Circle, Line } from 'react-konva'
import { ItemType } from '../../types'

const Compressor = ({ item }: { item: ItemType }) => {
  const centerX = item.width / 2
  const centerY = item.height / 2

  const radius = Math.max(item.height, item.width) / 2

  return (
    <Group id={item.id}>
      <Circle
        id={item.id}
        x={centerX}
        y={centerY}
        radius={radius}
        stroke="black"
        strokeWidth={2}
      />
      <Line
        id={item.id}
        points={[
          centerX - radius * 0.85,
          centerY - radius * 0.5,
          centerX + radius - 1,
          centerY - radius * 0.2,
        ]}
        strokeWidth={2}
        stroke="black"
        lineCap="round"
        lineJoin="round"
      />

      <Line
        id={item.id}
        points={[
          centerX - radius * 0.85,
          centerY + radius * 0.5,
          centerX + radius - 1,
          centerY + radius * 0.2,
        ]}
        strokeWidth={2}
        stroke="black"
        lineCap="round"
        lineJoin="round"
      />
    </Group>
  )
}

export default Compressor
