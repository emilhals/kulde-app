import React, { useRef, useState } from 'react'

import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { Circle, Group } from 'react-konva'

import {
    addToStore,
    getAnyFromStore,
} from '@/features/diagram-drawer/store/actions'
import { diagramHistory, uiState } from '@/features/diagram-drawer/store/models'
import { useSnapshot } from 'valtio'

import {
    Attachment,
    ConnectionPreview,
    ItemAttachment,
    Placement,
    PointType,
} from '@/features/diagram-drawer/types'
import { Border } from './Border'

import { computeT } from '@/features/diagram-drawer/utils/attachments'
import {
    getClosestPointOnSegment,
    getConnectionPoints,
} from '@/features/diagram-drawer/utils/connections/'

type HoveredItem = {
    id: string
    anchor?: Placement
}

type DragState =
    | { active: false }
    | {
          active: true
          startPos: PointType
          from: ItemAttachment
      }

type ConnectorProps = {
    stageRef: React.RefObject<Konva.Stage>
    updatePreview: (from: ItemAttachment, to: Attachment) => void
    clearPreview: () => void
}

export const Connector = ({
    stageRef,
    updatePreview,
    clearPreview,
}: ConnectorProps) => {
    const { activeId, selectedIds } = useSnapshot(uiState)

    const [hoveredItem, setHoveredItem] = useState<HoveredItem | null>(null)

    const previewAnchorRef = useRef<Konva.Circle>(null)

    const SNAP_RADIUS = 30

    const dragState = useRef<DragState>({ active: false })
    const snapRef = useRef<{
        position: PointType
        attachment: Attachment
    } | null>(null)
    const [activeAnchor, setActiveAnchor] = useState<Placement | null>(null)

    const detectConnection = (mousePosition: PointType) => {
        if (!stageRef.current) return null

        const intersected = stageRef.current.getIntersection(mousePosition)

        let node: Konva.Node | null = intersected

        while (node) {
            const proxyObj = getAnyFromStore(node.id())
            if (
                proxyObj?.type === 'connections' ||
                proxyObj?.type === 'items'
            ) {
                return proxyObj
            }
            node = node.getParent()
        }

        return null
    }

    const detectConnectable = (
        screenPointer: PointType,
        stagePointer: PointType,
    ): { attachment: Attachment; position: PointType } | null => {
        const stage = stageRef.current
        if (!stage) return null

        const intersected = stage.getIntersection(screenPointer)
        if (!intersected) return null

        let hoveredObject = getAnyFromStore(intersected?.id())
        if (!hoveredObject) return null

        if (hoveredObject.type === 'connections') {
            const pointsFlat = getConnectionPoints(hoveredObject)
            if (!pointsFlat) return null

            const points = []
            const segments = []

            for (let i = 0; i < pointsFlat.length / 2; i++) {
                points.push({
                    x: pointsFlat[i * 2],
                    y: pointsFlat[i * 2 + 1],
                })
            }

            for (let i = 0; i < points.length - 1; i++) {
                segments.push({
                    start: points[i],
                    end: points[i + 1],
                })
            }

            let closest = null
            let minDist = Infinity

            for (let i = 0; i < segments.length; i++) {
                const seg = segments[i]

                const point = getClosestPointOnSegment(
                    stagePointer,
                    seg.start,
                    seg.end,
                )

                const dx = point.x - stagePointer.x
                const dy = point.y - stagePointer.y
                const dist = dx * dx + dy * dy

                if (dist < minDist) {
                    minDist = dist
                    closest = {
                        position: { x: point.x, y: point.y },
                        segmentIndex: i,
                        t: point.t,
                    }
                }
            }

            if (closest) {
                const currentTarget: Attachment = {
                    type: 'connection',
                    connectionId: hoveredObject.id,
                    segmentIndex: closest.segmentIndex,
                    t: closest.t,
                }

                return {
                    attachment: currentTarget,
                    position: closest.position,
                }
            }
        }

        if (hoveredObject.type === 'items') {
            const anchors = stage.find('.anchor') ?? []
            const transform = stage.getAbsoluteTransform().copy().invert()

            let closest: Konva.Node | null = null
            let closestPos: PointType | null = null
            let minDist = Infinity

            for (const anchor of anchors) {
                const abs = anchor.getAbsolutePosition()
                const pos = transform.point(abs)
                const dx = pos.x - stagePointer.x
                const dy = pos.y - stagePointer.y
                const dist = Math.sqrt(dx * dx + dy * dy)

                if (dist < SNAP_RADIUS && dist < minDist) {
                    closest = anchor
                    closestPos = pos
                    minDist = dist
                }
            }

            if (closest && closestPos) {
                const placement = closest.id().split(':')[1] as Placement
                const currentTarget: Attachment = {
                    type: 'item',
                    itemId: hoveredObject.id,
                    placement: placement,
                    t: computeT(placement, closestPos, hoveredObject),
                }
                return { attachment: currentTarget, position: closestPos }
            }
        }

        return null
    }

    const handleAnchorDragStart = (e: KonvaEventObject<DragEvent>) => {
        uiState.pointerDown = false

        const stage = e.target.getStage()
        const pointer = stage?.getRelativePointerPosition()

        if (!pointer || !stage) return
        const transform = stage.getAbsoluteTransform().copy().invert()

        uiState.interaction = 'pending-connect'

        const abs = e.target.getAbsolutePosition()
        const anchorPos = transform.point(abs)

        if (!activeId) return

        const item = diagramHistory.value.items.find((i) => i.id === activeId)
        if (!item) return

        const placement = e.target.id().split(':')[1] as Placement
        if (!placement) return

        dragState.current = {
            active: true,
            startPos: anchorPos,
            from: {
                type: 'item',
                itemId: activeId,
                placement: placement,
                t: computeT(
                    placement,
                    { x: anchorPos.x, y: anchorPos.y },
                    item,
                ),
            },
        }
    }

    const handleAnchorDragMove = (e: KonvaEventObject<DragEvent>) => {
        if (uiState.interaction === 'pending-connect')
            uiState.interaction = 'connecting'

        const stage = e.target.getStage()
        if (!stage) return

        const pointerStage = stage.getRelativePointerPosition()
        const pointerScreen = stage.getPointerPosition()

        if (!pointerStage || !pointerScreen) return

        const container = stage.container()
        if (!container) return

        if (!dragState.current.active) return

        const hoveredObject = detectConnection(pointerScreen)

        const snap = detectConnectable(pointerScreen, pointerStage)
        snapRef.current = snap
        if (hoveredObject?.type === 'items') {
            let anchor: Placement | undefined = undefined

            if (
                snap?.attachment.type === 'item' &&
                snap.attachment.itemId === hoveredObject.id
            ) {
                anchor = snap.attachment.placement
            }

            setHoveredItem({
                id: hoveredObject.id,
                anchor,
            })
        } else {
            setHoveredItem(null)
        }

        const targetPosition = snap ? snap.position : pointerStage
        const to: Attachment = {
            type: 'free',
            position: targetPosition,
        }

        setActiveAnchor(dragState.current.from.placement)
        updatePreview(dragState.current.from, to)

        if (snap) {
            container.style.cursor = 'pointer'
        } else {
            container.style.cursor = 'crosshair'
        }
    }

    const handleAnchorDragEnd = (e: KonvaEventObject<DragEvent>) => {
        uiState.interaction = 'idle'
        clearPreview()

        setActiveAnchor(null)
        setHoveredItem(null)

        if (!dragState.current.active || !snapRef.current) return
        const { from } = dragState.current
        const to = snapRef.current.attachment
        if (to.type === 'free') return

        if (!from || !to) {
            dragState.current = { active: false }
            return
        }

        if (to.type === 'item' && from.itemId === to.itemId) return

        snapRef.current = null
        dragState.current = { active: false }
        const connection: ConnectionPreview = {
            type: 'connections',

            from: from,
            to: to,
        }

        addToStore(connection)

        const stage = e.target.getStage()
        const container = stage?.container()
        if (!container) return

        container.style.cursor = 'default'
    }

    const selectedBorders = selectedIds?.map((id) =>
        id === activeId ? (
            <Border
                key={id}
                itemId={activeId}
                active={activeAnchor}
                onAnchorDragMove={handleAnchorDragMove}
                onAnchorDragStart={handleAnchorDragStart}
                onAnchorDragEnd={(e: Konva.KonvaEventObject<DragEvent>) =>
                    handleAnchorDragEnd(e)
                }
            />
        ) : (
            <Border key={id} itemId={id} />
        ),
    )

    const hoveredItemBorder = hoveredItem ? (
        <Border
            itemId={hoveredItem.id}
            hoveredItemId={hoveredItem.id}
            hoveredAnchor={hoveredItem.anchor}
            onAnchorDragMove={handleAnchorDragMove}
            onAnchorDragStart={handleAnchorDragStart}
            onAnchorDragEnd={(e: Konva.KonvaEventObject<DragEvent>) =>
                handleAnchorDragEnd(e)
            }
        />
    ) : (
        <Group></Group>
    )

    const newLineAnchor =
        dragState.current.active &&
        snapRef.current &&
        snapRef.current.attachment.type === 'connection' ? (
            <Circle
                ref={previewAnchorRef}
                radius={7}
                fill="#A78BFA"
                x={snapRef.current.position.x}
                y={snapRef.current.position.y}
            />
        ) : (
            <Group></Group>
        )

    return (
        <Group>
            {selectedBorders}
            {hoveredItemBorder}
            {newLineAnchor}
        </Group>
    )
}
