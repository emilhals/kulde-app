import type { Point } from '@/features/simulator/types'
import { Group, Rect } from 'react-konva'

export const Compressor = ({ position }: { position: Point }) => {
  return (
    <Group x={position.x} y={position.y}>
      <Rect
        width={125}
        height={150}
        fill="black"
        cornerRadius={[30, 30, 30, 30]}
      />
    </Group>
  )
}
