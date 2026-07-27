import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Arc, Circle, Group, Line, Text } from 'react-konva'

const PressureGauge = ({
  item,
  strokeColor,
  fillColor,
}: {
  item: Item | ItemPreview
  strokeColor: string
  fillColor: string
}) => {
  const w = item.width
  const h = item.height
  const cx = w / 2
  const radius = Math.min(w, h) / 2 - 2
  const cy = radius + 2

  const itemId = 'id' in item ? item.id : ''

  return (
    <Group id={itemId} name="detectable">
      <Circle
        name="object"
        x={cx}
        y={cy}
        radius={radius}
        stroke={strokeColor}
        strokeWidth={2}
        fill={fillColor}
        listening={false}
      />
      <Arc
        x={cx}
        y={cy}
        innerRadius={radius * 0.75}
        outerRadius={radius * 0.75}
        angle={200}
        rotation={170}
        stroke={strokeColor}
        strokeWidth={1}
      />
      {/* Needle pointing to ~60% */}
      <Line
        points={[
          cx,
          cy,
          cx + radius * 0.55 * Math.cos((-110 * Math.PI) / 180),
          cy + radius * 0.55 * Math.sin((-110 * Math.PI) / 180),
        ]}
        stroke={strokeColor}
        strokeWidth={1.5}
        lineCap="round"
      />
      {/* Center dot */}
      <Circle x={cx} y={cy} radius={2} fill={fillColor} />
      {/* P label */}
      <Text
        text="P"
        fontSize={Math.max(radius * 0.4, 10)}
        fontFamily="Inter"
        fill={strokeColor}
        x={cx - radius * 0.12}
        y={cy + radius * 0.2}
      />
      {/* Connection pipe at bottom */}
      <Line
        points={[cx, cy + radius, cx, h]}
        stroke={strokeColor}
        strokeWidth={2}
        lineCap="round"
      />
    </Group>
  )
}

export default PressureGauge
