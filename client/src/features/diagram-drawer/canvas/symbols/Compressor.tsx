import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Circle, Group, Line } from 'react-konva'

const Compressor = ({
  item,
  strokeColor,
}: {
  item: Item | ItemPreview
  strokeColor: string
}) => {
  const centerX = item.width / 2
  const centerY = item.height / 2

  const radius = Math.max(item.height, item.width) / 2

  return (
    <Group>
      <Circle
        name="object"
        x={centerX}
        y={centerY}
        radius={radius}
        stroke={strokeColor}
        strokeWidth={2}
      />
      <Line
        name="object"
        points={[
          centerX - radius * 0.85,
          centerY - radius * 0.5,
          centerX + radius - 1,
          centerY - radius * 0.2,
        ]}
        strokeWidth={2}
        stroke={strokeColor}
        lineCap="round"
        lineJoin="round"
      />

      <Line
        name="object"
        points={[
          centerX - radius * 0.85,
          centerY + radius * 0.5,
          centerX + radius - 1,
          centerY + radius * 0.2,
        ]}
        strokeWidth={2}
        stroke={strokeColor}
        lineCap="round"
        lineJoin="round"
      />
    </Group>
  )
}

export default Compressor
