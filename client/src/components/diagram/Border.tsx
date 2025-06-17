import { Line, Group } from 'react-konva'
import { KonvaEventObject } from 'konva/lib/Node'

import { Anchor } from './Anchor'

import { ItemType } from '@/common/types'

import { state } from '@/stores/settingsStore'
import { useSnapshot } from 'valtio'

const getAnchorPoints = (x: number, y: number, height: number, width: number) => {
  return [
    {
      name: 'top',
      x: x + width / 2,
      y: y,
    },
    {
      name: 'left',
      x: x,
      y: y + height / 2
    },
    {
      name: 'right',
      x: x + width,
      y: y + height / 2,
    },
    {
      name: 'bottom',
      x: x + width / 2,
      y: y + height
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

  const snap = useSnapshot(state)

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
    <Group>
      {item ? (
        <Line
          x={item.x}
          y={item.y}
          points={points}
          stroke={snap.lightAccentColor}
          strokeWidth={2}
          listening={false}
          perfectDrawEnabled={false}
        />
      ) : null}
      {anchors}
    </Group>
  )
}

