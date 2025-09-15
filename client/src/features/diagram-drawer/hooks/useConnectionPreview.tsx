import { useState } from 'react'

import { Line } from 'react-konva'
import { Node, NodeConfig } from 'konva/lib/Node'

import { PointType } from '@/features/diagram-drawer/types'
import { createConnectionPoints } from '@/features/diagram-drawer/utils/createConnectionPoints'

export const useConnectionPreview = () => {
  const [connectionPreview, setConnectionPreview] = useState<React.ReactNode>()

  const setInitialPreview = (position: PointType) => {
    setConnectionPreview(
      <Line
        x={position.x}
        y={position.y}
        points={[position.x, position.y, position.x, position.y]}
        strokeWidth={4}
        stroke="#2d9cdb"
        lineJoin="round"
        lineCap="round"
        perfectDrawEnabled={false}
        shadowBlur={1}
        shadowColor="#ffffff"
        shadowOpacity={0.5}
        listening={false}
      />,
    )
  }

  const updatePreview = (
    position: PointType,
    mousePosition: PointType,
    draggedFromAnchor: Node<NodeConfig>,
    hoveredAnchor: Node<NodeConfig>,
  ) => {
    setConnectionPreview(
      <Line
        x={position.x}
        y={position.y}
        points={[0, 0].concat(
          createConnectionPoints(
            mousePosition,
            draggedFromAnchor,
            hoveredAnchor,
          ),
        )}
        strokeWidth={3}
        stroke="#2d9cdb"
        lineJoin="round"
        lineCap="round"
        listening={false}
        perfectDrawEnabled={false}
        shadowBlur={10}
        shadowOffsetY={1}
        shadowOffsetX={1}
        shadowColor="#42AEEC"
        shadowOpacity={0.5}
      />,
    )
  }

  const clearPreview = () => setConnectionPreview(null)

  return {
    connectionPreview,
    setInitialPreview,
    updatePreview,
    clearPreview,
  }
}
