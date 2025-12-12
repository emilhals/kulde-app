import React, { useState } from 'react'

import { Layer } from 'react-konva'
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'

import { useSnapshot } from 'valtio'
import {
  diagramHistory,
  getFromStore,
  uiState,
} from '@/features/diagram-drawer/store'

import {
  PointType,
  ItemType,
  PlacementType,
} from '@/features/diagram-drawer/types'
import { Border } from './Border'

import { useConnectionPreview } from '@/features/diagram-drawer/hooks/useConnectionPreview'
import { useCreateConnection } from '@/features/diagram-drawer/hooks/useCreateConnection'

import { hasIntersection } from '@/features/diagram-drawer/utils/helpers'

export const Connector = ({
  stageRef,
}: {
  stageRef: React.RefObject<Konva.Stage>
}) => {
  const [hoveredItem, setHoveredItem] = useState<ItemType | null>(null)

  const { connectionPreview, setInitialPreview, updatePreview, clearPreview } =
    useConnectionPreview()

  const { setInitialConnection, addConnectionToStore } = useCreateConnection()

  const [draggedFromAnchor, setDraggedFromAnchor] =
    useState<PlacementType>(null)
  const [hoveredAnchor, setHoveredAnchor] = useState<PlacementType>(null)

  const uiSnap = useSnapshot(uiState)

  const detectConnection = (mousePosition: PointType) => {
    if (!stageRef.current) return null

    const intersected = stageRef.current.getIntersection(mousePosition)
    if (!intersected || intersected.id() === uiState.selected?.id) {
      setHoveredItem(null)
      return null
    }

    const proxyHoveredItem = getFromStore(intersected.id())
    setHoveredItem(proxyHoveredItem as ItemType)
  }

  const detectAnchor = (mousePosition: PointType) => {
    const intersection = stageRef.current?.find('.anchor').find((obj) => {
      return hasIntersection(mousePosition, obj)
    })

    if (intersection) {
      setHoveredAnchor(intersection.id() as PlacementType)
      return intersection
    }
  }

  const handleAnchorDragStart = (e: KonvaEventObject<DragEvent>) => {
    const position = e.target.position()

    setDraggedFromAnchor(e.target.id() as PlacementType)

    const proxyFromItem = diagramHistory.value.items.find(
      (item) => item.id === uiSnap.selected?.id,
    )
    if (!proxyFromItem) return null

    setInitialConnection(proxyFromItem)
    setInitialPreview(position)
  }

  const handleAnchorDragMove = (e: KonvaEventObject<DragEvent>) => {
    const position = e.target.position()
    const stage = e.target.getStage()
    const pointerPosition = stage?.getPointerPosition()

    const container = stage?.container()
    if (!container) return null
    container.style.cursor = 'grab'

    if (!pointerPosition) return null
    const mousePosition = {
      x: pointerPosition.x - position.x,
      y: pointerPosition.y - position.y,
    }

    const clickedAnchor = e.target.id()
    const anchorNode = stageRef.current?.find('#' + clickedAnchor)[0]

    detectConnection(pointerPosition)
    const hoveredItemAnchor = detectAnchor(pointerPosition)

    if (hoveredItemAnchor && detectConnection(pointerPosition)) {
      setHoveredAnchor(hoveredItemAnchor.id() as PlacementType)
    }

    updatePreview(position, mousePosition, anchorNode, hoveredItemAnchor)
  }

  const handleAnchorDragEnd = (e: KonvaEventObject<DragEvent>) => {
    clearPreview()
    const stage = e.target.getStage()

    const mousePosition = stage?.getPointerPosition()
    if (!mousePosition) return null

    if (!hoveredItem) return null

    const toItem = diagramHistory.value.items.find(
      (item) => item.id === hoveredItem.id,
    )
    if (!toItem) return null

    addConnectionToStore(toItem, draggedFromAnchor, hoveredAnchor)

    const container = stage?.container()
    if (!container) return null

    container.style.cursor = 'default'

    setHoveredItem(null)
    setHoveredAnchor(null)
    setDraggedFromAnchor(null)
  }

  const selectedBorder =
    uiState.selected !== null ? (
      <Border
        item={uiState.selected}
        onAnchorDragEnd={(e: Konva.KonvaEventObject<DragEvent>) =>
          handleAnchorDragEnd(e)
        }
        onAnchorDragMove={handleAnchorDragMove}
        onAnchorDragStart={handleAnchorDragStart}
      />
    ) : null

  const hoveredItemBorder =
    hoveredItem !== null ? (
      <Border item={hoveredItem} hovered={hoveredAnchor} />
    ) : null

  return (
    <Layer>
      {selectedBorder}
      {hoveredItemBorder}
      {connectionPreview}
    </Layer>
  )
}
