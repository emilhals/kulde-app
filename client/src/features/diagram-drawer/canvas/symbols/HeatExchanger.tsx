import { Group, Circle, Path, Rect } from 'react-konva'
import { ItemType } from '@/features/diagram-drawer/types'

const HeatExchanger = ({ item }: { item: ItemType }) => {
  const centerX = item.width / 2
  const centerY = item.height / 2

  const radius = Math.max(item.height, item.width) / 4

  const numBlades = 6
  const bladeRadius = radius * 0.9

  const createFanBlades = () => {
    const blades = []

    for (let i = 0; i < numBlades; i++) {
      const angle = (360 / numBlades) * i
      const bladeLength = bladeRadius * 0.9

      const pathData = `M 0,0 Q ${bladeLength * 0.6},${-bladeLength * 0.4} ${bladeLength},0 Q ${bladeLength * 0.1},${bladeLength * 0.2} 0,0`

      blades.push(
        <Path
          key={i}
          data={pathData}
          stroke="black"
          strokeWidth={2}
          rotation={angle}
          opacity={1}
        />,
      )
    }

    return blades
  }
  return (
    <Group id={item.id}>
      <Rect
        id={item.id}
        name="object"
        y={0}
        x={0}
        width={item.width}
        height={item.height}
        stroke="black"
        strokeWidth={2}
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

      <Group x={centerX} y={centerY}>
        {createFanBlades()}
      </Group>
    </Group>
  )
}

export default HeatExchanger
