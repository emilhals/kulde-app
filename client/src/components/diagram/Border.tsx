import { Line } from 'react-konva'
import { KonvaEventObject } from 'konva/lib/Node'

import { Anchor } from './Anchor'

import { ItemType } from '@/common/types'

const getAnchorPoints = (x: number, y: number, height: number, width: number) => {
  return [
    {
      name: 'top',
      x: x + width / 2,
      y: y - 15,
    },
    {
      name: 'left',
      x: x - 15,
      y: y + height / 2
    },
    {
      name: 'right',
      x: x + width + 15,
      y: y + height / 2,
    },
    {
      name: 'bottom',
      x: x + width / 2,
      y: y + height + 15
    }
  ]
}

type PropsType = {
  item: ItemType
  hovered: string
  onAnchorDragStart: (e: KonvaEventObject<DragEvent>, id: string | number) => void
  onAnchorDragMove: (e: KonvaEventObject<DragEvent>, id: string | number) => void
  onAnchorDragEnd: (e: KonvaEventObject<DragEvent>, id: string | number) => void
}

export const Border = ({ item, hovered, onAnchorDragStart, onAnchorDragMove, onAnchorDragEnd }: PropsType) => {
  if (!item) return

  const anchorPoints = getAnchorPoints(item.x, item.y, item.height, item.width)

  const points = [0, 0, item.height, 0, item.height, item.height, 0, item.height, 0, 0]

  const anchors = anchorPoints.map(({ x, y, name }) => (
    <Anchor
      key={`anchor-${name}`}
      id={name}
      x={x}
      y={y}
      hovered={hovered}
      onDragStart={onAnchorDragStart}
      onDragMove={onAnchorDragMove}
      onDragEnd={onAnchorDragEnd}
    />
  ))

  return (
    <>
      <Line
        x={item.x}
        y={item.y}
        points={points}
        stroke='#E83F6F'
        strokeWidth={2}
        listening={false}
        perfectDrawEnabled={false}
      />
      {anchors}
    </>
  )
}

