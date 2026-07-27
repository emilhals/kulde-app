import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Circle, Group, Line, Text } from 'react-konva'

const PressureSwitch = ({
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
  const radius = Math.min(w, h * 0.55) / 2 - 2
  const cy = radius + 2

  const itemId = 'id' in item ? item.id : ''

  return (
    <Group id={itemId}>
      {/* Instrument circle */}
      <Circle
        name="object"
        x={cx}
        y={cy}
        radius={radius}
        stroke={strokeColor}
        strokeWidth={2}
        fill={fillColor}
      />
      {/* PS label */}
      <Text
        text="PS"
        fontSize={Math.max(radius * 0.5, 9)}
        fontFamily="Inter"
        fill={fillColor}
        x={cx - radius * 0.38}
        y={cy - radius * 0.32}
      />
      {/* Connection pipe down */}
      <Line
        points={[cx, cy + radius, cx, h * 0.72]}
        stroke={strokeColor}
        strokeWidth={2}
        lineCap="round"
      />
      {/* Switch symbol — angled line (normally open) */}
      <Line
        points={[cx - w * 0.22, h * 0.72, cx + w * 0.22, h * 0.72]}
        stroke={strokeColor}
        strokeWidth={1.5}
        lineCap="round"
      />
      <Line
        points={[cx - w * 0.22, h * 0.72, cx - w * 0.22, h]}
        stroke={strokeColor}
        strokeWidth={1.5}
        lineCap="round"
      />
      <Line
        points={[cx + w * 0.22, h * 0.85, cx + w * 0.22, h]}
        stroke={strokeColor}
        strokeWidth={1.5}
        lineCap="round"
      />
      {/* Switch blade (angled = open) */}
      <Line
        points={[cx - w * 0.22, h * 0.72, cx + w * 0.15, h * 0.85]}
        stroke={strokeColor}
        strokeWidth={1.5}
        lineCap="round"
      />
    </Group>
  )
}

export default PressureSwitch
