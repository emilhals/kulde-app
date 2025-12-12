import { Group, Circle, Line } from 'react-konva'
import { ItemType, ComponentContext } from '@/features/diagram-drawer/types'
import { uiState } from '../../store'

const Compressor = ({
  item,
  context = 'Diagram',
}: {
  item: ItemType
  context?: ComponentContext
}) => {
  const centerX = item.width / 2
  const centerY = item.height / 2

  const radius = Math.max(item.height, item.width) / 2

  return (
    <Group id={item.id}>
      <Circle
        name="object"
        id={item.id}
        x={context === 'Diagram' ? centerX : item.x}
        y={context === 'Diagram' ? centerY : item.y}
        radius={radius}
        stroke="black"
        strokeWidth={2}
      />
      <Line
        name="object"
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
        name="object"
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
