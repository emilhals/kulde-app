import { PointType } from '@/features/diagram-drawer/types'
import { Group, Rect, Text } from 'react-konva'
import { CompressorType } from '../types'

const Compressor = ({
  position,
  data,
}: {
  position: PointType
  data: CompressorType
}) => {
  return (
    <Group x={position.x} y={position.y}>
      <Text text="Compressor" fontFamily="Inter" fontSize={16} x={15} y={-20} />

      <Text
        x={170}
        y={-30}
        text={`${data.discharge_pressure} bar`}
        fontSize={12}
        fontFamily={'Inter'}
      />
      <Text
        x={170}
        y={-15}
        text={`${data.discharge_temp} °C`}
        fontSize={12}
        fontFamily={'Inter'}
      />

      <Rect
        width={125}
        height={150}
        fill="black"
        cornerRadius={[30, 30, 30, 30]}
      />
    </Group>
  )
}

export default Compressor
