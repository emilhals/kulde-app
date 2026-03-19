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

import { PointType, PlacementType } from '@/features/diagram-drawer/types'
import { Border } from './Border'

import { useConnectionPreview } from '@/features/diagram-drawer/hooks/useConnectionPreview'
import { useCreateConnection } from '@/features/diagram-drawer/hooks/useCreateConnection'

export const Connector = ({
    stageRef,
}: {
    stageRef: React.RefObject<Konva.Stage>
}) => {
    const uiSnap = useSnapshot(uiState)
    const diagramSnap = useSnapshot(diagramHistory)

    const {
        connectionPreview,
        setInitialPreview,
        updatePreview,
        clearPreview,
    } = useConnectionPreview()

    const { setInitialConnection, addConnectionToStore } = useCreateConnection()

    const [draggedFromAnchor, setDraggedFromAnchor] =
        useState<PlacementType>(null)
    const [hoveredAnchor, setHoveredAnchor] = useState<PlacementType>(null)

    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const hoveredItemObj = hoveredItem
        ? diagramSnap.value.items.find((i) => i.id === hoveredItem)
        : null

    const SNAP_RADIUS = 20

    const detectConnection = (mousePosition: PointType) => {
        if (!stageRef.current) return null

        const intersected = stageRef.current.getIntersection(mousePosition)

        if (!intersected || intersected.id() === uiState.selected?.id) {
            setHoveredItem(null)
            return null
        }
        let node = intersected

        while (node && !getFromStore(node.id())) {
            node = node.getParent()
        }

        if (!node) {
            setHoveredItem(null)
            return null
        }
        const obj = getFromStore(node.id())

        if (!obj || obj.type !== 'items') {
            setHoveredItem(null)
            return null
        }

        setHoveredItem(obj.id)
        return obj
    }

    const detectAnchor = (mousePosition: PointType) => {
        const anchors = stageRef.current?.find('.anchor') ?? []

        let closest: Konva.Node | null = null
        let minDist = Infinity

        anchors.forEach((anchor) => {
            const pos = anchor.getAbsolutePosition()

            const dx = pos.x - mousePosition.x
            const dy = pos.y - mousePosition.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < SNAP_RADIUS && dist < minDist) {
                closest = anchor
                minDist = dist
            }
        })

        if (closest) {
            setHoveredAnchor(closest.id() as PlacementType)
            return closest
        }

        setHoveredAnchor(null)
        return null
    }

    const handleAnchorDragStart = (e: KonvaEventObject<DragEvent>) => {
        const position = e.target.getAbsolutePosition()

        setDraggedFromAnchor(e.target.id() as PlacementType)

        const proxyFromItem = diagramSnap.value.items.find(
            (item) => item.id === uiSnap.selected?.id,
        )
        if (!proxyFromItem) return null

        setInitialConnection(proxyFromItem.id)
        setInitialPreview(position)
    }

    const handleAnchorDragMove = (e: KonvaEventObject<DragEvent>) => {
        const position = e.target.getAbsolutePosition()
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
        const anchorNode = stageRef.current?.findOne('#' + clickedAnchor)

        detectConnection(pointerPosition)
        const hoveredItemAnchor = detectAnchor(pointerPosition)

        let targetPosition = mousePosition

        if (hoveredItemAnchor) {
            const anchorPos = hoveredItemAnchor.getAbsolutePosition()

            targetPosition = {
                x: anchorPos.x - position.x,
                y: anchorPos.y - position.y,
            }
        }

        if (!anchorNode) return null

        updatePreview(position, targetPosition, anchorNode, hoveredItemAnchor)
    }

    const handleAnchorDragEnd = (e: KonvaEventObject<DragEvent>) => {
        clearPreview()

        const stage = e.target.getStage()

        const mousePosition = stage?.getPointerPosition()
        if (!mousePosition) return null

        if (!hoveredItem) return null

        const toItem = diagramSnap.value.items.find(
            (item) => item.id === hoveredItem,
        )
        if (!toItem) return null

        if (!hoveredAnchor || !draggedFromAnchor) return

        addConnectionToStore(toItem.id, draggedFromAnchor, hoveredAnchor)

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

    const hoveredItemBorder = hoveredItemObj ? (
        <Border item={hoveredItemObj} hovered={hoveredAnchor} />
    ) : null

    return (
        <Layer>
            {selectedBorder}
            {hoveredItemBorder}
            {connectionPreview}
        </Layer>
    )
}
