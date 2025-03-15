import { Line } from 'react-konva'

import { Anchor } from './Anchor'

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

export const Border = ({ item, onAnchorDragStart, onAnchorDragMove, onAnchorDragEnd }) => {
  if (!item) return

  const anchorPoints = getAnchorPoints(item.x, item.y, item.height, item.width)

  const SIZE = 128
  const points = [0, 0, SIZE, 0, SIZE, SIZE, 0, SIZE, 0, 0]

  const anchors = anchorPoints.map(({ x, y, name }) => (
    <Anchor
      key={`anchor-${name}`}
      id={name}
      x={x}
      y={y}
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
        stroke="green"
        strokeWidth={2}
        perfectDrawEnabled={false}
      />
      {anchors}
    </>
  )
}

