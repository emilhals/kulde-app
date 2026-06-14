import { Group, RegularPolygon, Text } from 'react-konva'
import { Point } from '../types'

export const TEV = ({ position }: { position: Point }) => {
  return (
    <Group x={position.x} y={position.y}>
      <Text text="TEV" fontFamily="Inter" fontSize={16} x={15} y={0} />
      <RegularPolygon
        sides={3}
        radius={12}
        rotation={180}
        stroke="black"
        strokeWidth={2}
      />

      <RegularPolygon
        sides={3}
        radius={12}
        rotation={0}
        y={25}
        stroke="black"
        strokeWidth={2}
      />

      <RegularPolygon
        sides={3}
        radius={8}
        rotation={90}
        x={-8}
        y={12}
        stroke="black"
        strokeWidth={2}
      />
    </Group>
  )
}
