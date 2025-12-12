import { Line, Group } from 'react-konva'
import { KonvaEventObject } from 'konva/lib/Node'

import { getAnchorOffset } from '@/features/diagram-drawer/utils/helpers'
import { Anchor } from '@/features/diagram-drawer/canvas/Anchor'
import {
  ItemType,
  PointType,
  PlacementType,
} from '@/features/diagram-drawer/types'

import { diagramHistory } from '@/features/diagram-drawer/store'

export type AnchorType = PointType & {
  name: string
}

const getAnchorPoints = (item: ItemType): AnchorType[] => {
  const anchors: AnchorType[] = []

  const { offsetX, offsetY } = getAnchorOffset(item)

  item.anchors.position.map((placement) => {
    if (placement === 'Top') {
      anchors.push({
        name: 'Top',
        x: item.x + item.width / 2 + offsetX,
        y: item.y + offsetY,
      })
    }
    if (placement === 'Bottom') {
      anchors.push({
        name: 'Bottom',
        x: item.x + item.width / 2 + offsetX,
        y: item.y + item.height + offsetY,
      })
    }

    if (placement === 'Left') {
      anchors.push({
        name: 'Left',
        x: item.x + offsetX,
        y: item.y + item.height / 2 + offsetY,
      })
    }

    if (placement === 'Right') {
      anchors.push({
        name: 'Right',
        x: item.x + item.width + offsetX,
        y: item.y + item.height / 2 + offsetY,
      })
    }
  })

  return anchors
}

type BorderProps = {
  item: ItemType
  hovered?: PlacementType
  onAnchorDragStart: (
    e: KonvaEventObject<DragEvent>,
    placement: PlacementType,
  ) => void
  onAnchorDragMove: (
    e: KonvaEventObject<DragEvent>,
    placement: PlacementType,
  ) => void
  onAnchorDragEnd: (
    e: KonvaEventObject<DragEvent>,
    placement: PlacementType,
  ) => void
}

export const Border = ({
  item,
  hovered,
  onAnchorDragStart,
  onAnchorDragMove,
  onAnchorDragEnd,
}: BorderProps) => {
  if (!item) return null

  const proxyItem = diagramHistory.value.items.find((i) => i.id === item.id)
  if (!proxyItem) return null

  const anchorPoints = getAnchorPoints(proxyItem)
  const borderPoints = [
    0,
    0,
    proxyItem.width,
    0,
    proxyItem.width,
    proxyItem.height,
    0,
    proxyItem.height,
    0,
    0,
  ]

  const anchors = anchorPoints.map(({ x, y, name }) => (
    <Anchor
      key={`${item.id}-anchor-${name}`}
      placement={name}
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
          id={proxyItem.id}
          x={proxyItem.x}
          y={proxyItem.y}
          points={borderPoints}
          stroke="#00A1E4"
          strokeWidth={2}
          listening={false}
          perfectDrawEnabled={false}
        />
      ) : null}
      {anchors}
    </Group>
  )
}
