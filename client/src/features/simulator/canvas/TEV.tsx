import { Group, RegularPolygon } from 'react-konva'
import { PositionType } from '../types'

const TEV = ({ position }: { position: PositionType }) => {
  return (
    <Group x={position.x} y={position.y}>
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

export default TEV
