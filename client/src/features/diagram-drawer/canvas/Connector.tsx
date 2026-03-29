import React, { useState } from 'react'

import { Layer } from 'react-konva'
import Konva from 'konva'
import { Node, NodeConfig, KonvaEventObject } from 'konva/lib/Node'

import { useSnapshot } from 'valtio'
import {
    diagramHistory,
    getFromStore,
    uiState,
} from '@/features/diagram-drawer/store'

import { PointType, Placement } from '@/features/diagram-drawer/types'
import { Border } from './Border'

import { useCreateConnection } from '@/features/diagram-drawer/hooks/useCreateConnection'

type ConnectorProps = {
    stageRef: React.RefObject<Konva.Stage>
    setInitialPreview: (position: PointType) => void
    updatePreview: (
        startPos: PointType,
        targetPosition: PointType,
        draggedFromAnchor: Node<NodeConfig>,
        hoveredAnchor: Node<NodeConfig> | null,
    ) => void
    clearPreview: () => void
}

export const Connector = ({
    stageRef,
    setInitialPreview,
    updatePreview,
    clearPreview,
}: ConnectorProps) => {
    const uiSnap = useSnapshot(uiState)
    const diagramSnap = useSnapshot(diagramHistory)

    const { setInitialConnection, addConnectionToStore } = useCreateConnection()

    const [draggedFromAnchor, setDraggedFromAnchor] =
        useState<Placement | null>(null)
    const [hoveredAnchor, setHoveredAnchor] = useState<Placement | null>(null)

    const [startPos, setStartPos] = useState<PointType | null>(null)

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
        const stage = stageRef.current
        if (!stage) return null

        const transform = stage.getAbsoluteTransform().copy().invert()

        let closest: Konva.Node | null = null
        let minDist = Infinity

        anchors.forEach((anchor) => {
            const abs = anchor.getAbsolutePosition()
            const pos = transform.point(abs)
            const dx = pos.x - mousePosition.x
            const dy = pos.y - mousePosition.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < SNAP_RADIUS && dist < minDist) {
                closest = anchor
                minDist = dist
            }
        })

        if (closest !== null) {
            setHoveredAnchor(closest.id() as Placement)
            return closest
        }

        setHoveredAnchor(null)
        return null
    }

    const handleAnchorDragStart = (e: KonvaEventObject<DragEvent>) => {
        const stage = e.target.getStage()
        const pointer = stage?.getRelativePointerPosition()

        if (!pointer || !stage) return
        const transform = stage.getAbsoluteTransform().copy().invert()

        const abs = e.target.getAbsolutePosition()
        const anchorPos = transform.point(abs)
        setStartPos(anchorPos)

        setDraggedFromAnchor(e.target.id() as Placement)

        const proxyFromItem = diagramSnap.value.items.find(
            (item) => item.id === uiSnap.selected?.id,
        )
        if (!proxyFromItem) return null

        setInitialConnection(proxyFromItem.id)
        setInitialPreview(anchorPos)
    }

    const handleAnchorDragMove = (e: KonvaEventObject<DragEvent>) => {
        if (!startPos) return

        const stage = e.target.getStage()

        const pointerStage = stage?.getRelativePointerPosition()
        const pointerScreen = stage?.getPointerPosition()

        if (!pointerStage || !pointerScreen) return

        const container = stage?.container()
        if (!container) return

        const clickedAnchor = e.target.id()
        const anchorNode = stageRef.current?.findOne('#' + clickedAnchor)

        if (!anchorNode) return

        detectConnection(pointerScreen)
        const hoveredItemAnchor = detectAnchor(
            pointerStage,
        ) as Konva.Node | null

        let targetPosition = pointerStage

        if (hoveredItemAnchor && stage) {
            const transform = stage.getAbsoluteTransform().copy().invert()
            const abs = hoveredItemAnchor.getAbsolutePosition()
            targetPosition = transform.point(abs)
        }
        updatePreview(startPos, targetPosition, anchorNode, hoveredItemAnchor)

        if (hoveredItemAnchor) {
            container.style.cursor = 'pointer'
        } else {
            container.style.cursor = 'crosshair'
        }
    }

    const handleAnchorDragEnd = (e: KonvaEventObject<DragEvent>) => {
        clearPreview()

        const stage = e.target.getStage()

        const prevDragged = draggedFromAnchor
        const prevHovered = hoveredAnchor

        setHoveredItem(null)
        setHoveredAnchor(null)
        setDraggedFromAnchor(null)

        const toItem = diagramSnap.value.items.find(
            (item) => item.id === hoveredItem,
        )
        if (!toItem) return

        if (!prevDragged || !prevHovered) return

        addConnectionToStore(toItem.id, prevDragged, prevHovered)
        uiState.selected = null

        const container = stage?.container()
        if (!container) return

        container.style.cursor = 'default'
    }

    const selectedBorder =
        uiState.selected !== null ? (
            <Border
                item={uiState.selected}
                onAnchorDragEnd={(e: Konva.KonvaEventObject<DragEvent>) =>
                    handleAnchorDragEnd(e)
                }
                active={draggedFromAnchor}
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
        </Layer>
    )
}
