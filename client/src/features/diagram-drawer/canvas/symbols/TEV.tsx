import { Group, Line, Rect, Circle, Text, RegularPolygon } from 'react-konva'
import { ItemType } from '@/features/diagram-drawer/types'

const TEV = ({ item }: { item: ItemType }) => {
  if (!item) return null

  return (
    <Group id={item.id}>
      <Rect
        id={item.id}
        name="object"
        width={item.width}
        height={item.height}
      />

      <Line
        points={[
          item.width * 0.85 - 12,
          0,
          item.width * 0.2,
          0,
          item.width * 0.2,
          item.height - 16,
        ]}
        stroke="black"
        strokeWidth={2}
      />

      {/* Circle on top */}
      <Circle
        x={item.width * 0.85 - 12}
        y={12}
        radius={12}
        stroke="black"
        strokeWidth={2}
      />

      {/* Line between the two circles */}
      <Line
        points={[
          item.width * 0.85,
          item.height / 2 - 16,
          item.width * 0.85,
          12,
        ]}
        stroke="black"
        strokeWidth={2}
      />

      {/* Circle with label */}
      <Circle
        x={item.width * 0.85}
        y={item.height / 2}
        radius={16}
        stroke="black"
        strokeWidth={2}
      />

      <Text
        text="TC"
        fontSize={16}
        fontFamily="Inter"
        fill="black"
        x={item.width * 0.85 - 11}
        y={item.height / 2 - 8}
      />

      {/* Line that goes from circle above to the bottom */}
      <Line
        points={[
          item.width * 0.85,
          item.height / 2 + 16,
          item.width * 0.85,
          item.height,
        ]}
        stroke="black"
        strokeWidth={2}
      />

      {/* Circle on bottom */}
      <Circle
        x={item.width * 0.2}
        y={item.height - 8}
        radius={8}
        stroke="black"
        strokeWidth={2}
      />

      {/* Valve */}
      <RegularPolygon
        sides={3}
        radius={12}
        rotation={90}
        x={item.width * 0.85 - 12}
        y={item.height}
        stroke="black"
        strokeWidth={2}
      />

      <RegularPolygon
        sides={3}
        radius={12}
        rotation={-90}
        x={item.width * 0.85 + 12}
        y={item.height}
        stroke="black"
        strokeWidth={2}
      />

      <RegularPolygon
        sides={3}
        radius={8}
        rotation={0}
        x={item.width * 0.85}
        y={item.height + 8}
        stroke="black"
        strokeWidth={2}
      />

      {/* Bottom line */}
      <Line
        points={[0, item.height, item.width * 0.85 - 18, item.height]}
        stroke="black"
        strokeWidth={2}
      />
      <Line
        points={[item.width - 7, item.height, item.width + 18, item.height]}
        stroke="black"
        strokeWidth={2}
      />
    </Group>
  )
}

export default TEV
