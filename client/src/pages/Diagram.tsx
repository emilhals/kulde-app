import { Connector } from '@/features/diagram-drawer/canvas/Connector'
import { ItemNode } from '@/features/diagram-drawer/canvas/ItemNode'
import { Line } from '@/features/diagram-drawer/canvas/Line'
import { Selection } from '@/features/diagram-drawer/canvas/Selection'
import { TextNode } from '@/features/diagram-drawer/canvas/TextNode'
import { useConnectionPreview } from '@/features/diagram-drawer/hooks/useConnectionPreview'
import { useCustomFont } from '@/features/diagram-drawer/hooks/useCustomFont'
import { useSnapToItem } from '@/features/diagram-drawer/hooks/useSnapToItem'
import {
    addToStore,
    getAnyFromStore,
    removeFromStore,
} from '@/features/diagram-drawer/store/actions'
import { diagramHistory, uiState } from '@/features/diagram-drawer/store/models'
import type {
    Connection,
    Geometry,
    Item,
    Point,
    Rect,
    SnapPoint,
    WithoutId,
} from '@/features/diagram-drawer/types'
import ComponentPanel from '@/features/diagram-drawer/ui/ComponentPanel'
import ContextMenu from '@/features/diagram-drawer/ui/ContextMenu'
import { ExportCanvas } from '@/features/diagram-drawer/ui/modals/ExportCanvas'
import { Toolbar } from '@/features/diagram-drawer/ui/Toolbar'
import { intersected } from '@/features/diagram-drawer/utils/konva'
import Konva from 'konva'
import { KonvaPointerEvent } from 'konva/lib/PointerEvents'
import React, { useEffect, useRef, useState } from 'react'
import {
    Group,
    Line as KonvaLine,
    Layer,
    Stage,
    Transformer,
} from 'react-konva'
import { useOutletContext } from 'react-router'
import { useSnapshot } from 'valtio'

type SnapState = {
    x: SnapPoint | null
    y: SnapPoint | null
}

const DiagramPage = () => {
    const { setNavContent } = useOutletContext<{
        setNavContent: (value: unknown) => void
    }>()

    const stageRef = useRef<Konva.Stage>(null)
    const selectionRef = useRef<Konva.Transformer>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const itemLayer = useRef<Konva.Layer>(null)

    const [,] = useCustomFont('Inter')

    const [stage, setStage] = useState({ width: 0, height: 0, scale: 1 })

    const [isPanning, setIsPanning] = useState(false)
    const [isSnapping, setIsSnapping] = useState(false)

    const DRAG_THRESHOLD = 4

    const [contextMenuPosition, setContextMenuPosition] =
        useState<Point | null>(null)

    const diagramSnap = useSnapshot(diagramHistory)
    const { connectionPreview, updatePreview, clearPreview } =
        useConnectionPreview()

    const snapStateRef = useRef<SnapState>({
        x: null,
        y: null,
    })
    const lineXRef = useRef<Konva.Line | null>(null)
    const lineYRef = useRef<Konva.Line | null>(null)

    const SNAP_RANGE = { in: 5, out: 8 }
    const { snap } = useSnapToItem()

    const uiSnap = useSnapshot(uiState)

    /* set stage size and ensure responsiveness  */
    useEffect(() => {
        const resize = () => {
            if (!containerRef.current) return
            const { clientWidth, clientHeight } = containerRef.current
            setStage({
                scale: 1,
                width: clientWidth,
                height: clientHeight,
            })
        }

        containerRef.current?.focus()

        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [])

    useEffect(() => {
        setNavContent({
            right: (
                <ExportCanvas>
                    <span className="font-bold px-3 py-1 rounded-md border">
                        Export
                    </span>
                </ExportCanvas>
            ),
        })

        return () => {
            setNavContent({ right: null })
        }
    }, [setNavContent])

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button === 1) {
            e.preventDefault()
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()

        if (!stageRef.current) return

        const stage = stageRef.current
        stage.setPointersPositions(e)

        const position = stage.getRelativePointerPosition()
        const dragged = uiState.dragged

        if (!position || !dragged) return

        const newItem: WithoutId<Item> = {
            type: 'items',
            component: dragged.component,
            height: dragged.height,
            width: dragged.width,
            x: position.x - dragged.width / 2,
            y: position.y - dragged.height / 2,
            locked: false,
            anchors: dragged.anchors,
        }

        const addedItem = addToStore(newItem)
        if (!addedItem) return

        addToStore({
            type: 'texts',
            content: '',
            position: {
                x: newItem.x + newItem.width / 2,
                y: newItem.y - 20,
            },
            color: '#000000',
            size: 14,
            attributes: [],
            anchor: {
                type: 'item',
                itemId: addedItem.id,
                offset: { x: 0, y: -20 },
            },
        })

        uiState.dragged = null
    }

    const handleContextMenu = (e: KonvaPointerEvent) => {
        e.evt.preventDefault()
        if (e.target === e.target.getStage()) return

        const stage = e.target.getStage()
        if (!stage) return

        const containerRect = stage.container().getBoundingClientRect()
        const pointerPosition = stage.getPointerPosition()
        if (!containerRect || !pointerPosition) return

        const offset = 4
        setContextMenuPosition({
            x: containerRect.left + pointerPosition.x + offset,
            y: containerRect.top + pointerPosition.y + offset,
        })

        e.cancelBubble = true
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const activeElement = document.activeElement

        if (activeElement?.tagName === 'INPUT') {
            return
        }

        if (e.metaKey && e.key === 'Backspace') {
            for (const selectedId of uiState.selectedIds) {
                removeFromStore(selectedId)
            }
        }

        /* This was to not cause issues with the context menu, maybe take deeper look at it later */
        if (
            [
                ' ',
                'Shift',
                'ArrowRight',
                'ArrowLeft',
                'ArrowUp',
                'ArrowDown',
                'Escape',
            ].includes(e.key)
        ) {
            e.preventDefault()
        } else {
            return
        }

        const activeNode = uiState.activeNode
        const itemProxy = activeNode
            ? diagramHistory.value.items.find((i) => i.id === activeNode.id)
            : null

        const container = stageRef.current?.container()
        if (!container) return

        switch (e.key) {
            case ' ':
                setIsPanning(true)
                container.style.cursor = 'grab'
                break
            case 'Shift':
                setIsSnapping(true)
                break
            case 'ArrowRight':
                if (itemProxy) itemProxy.x += 4
                break
            case 'ArrowLeft':
                if (itemProxy) itemProxy.x -= 4
                break
            case 'ArrowUp':
                if (itemProxy) itemProxy.y -= 4
                break
            case 'ArrowDown':
                if (itemProxy) itemProxy.y += 4
                break
            case 'Escape':
                uiState.activeNode = null
                uiState.action = null
                setContextMenuPosition(null)
                break
            case 'Return':
                uiState.action = null
                break
            default:
                break
        }
    }

    const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === ' ') {
            setIsPanning(false)
            const container = stageRef.current?.container()
            if (container) container.style.cursor = 'default'
        }
        if (e.key === 'Shift') {
            setIsSnapping(false)
        }
    }

    const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
        const stage = e.target.getStage()
        if (!stage) return

        if (e.target === stage) {
            setContextMenuPosition(null)
        }
        const pointer = stage.getRelativePointerPosition()
        if (!pointer) return

        const itemNode = e.target.findAncestor('.item')

        const node = getAnyFromStore(e.target.id())
        if (node && node.type === 'connections') {
            uiState.activeNode = {
                id: node.id,
                type: 'connection',
            }
        }

        if (itemNode) {
            if (uiState.selectedIds.includes(itemNode.id())) {
            } else {
                uiState.activeNode = {
                    id: itemNode.id(),
                    type: 'item',
                }
                uiState.selectedIds = [itemNode.id()]
            }

            const item = diagramHistory.value.items.find(
                (i) => i.id === itemNode.id(),
            )
            if (!item) return

            uiState.interaction = 'pending-drag'
            uiState.dragOffset = {
                x: pointer.x - item.x,
                y: pointer.y - item.y,
            }
            uiState.selectedIds.forEach((id) => {
                const item = diagramHistory.value.items.find((i) => i.id === id)
                if (!item) return

                uiState.dragStartPositions[id] = {
                    x: item.x,
                    y: item.y,
                }
            })
        } else {
            uiState.activeNode = null
            uiState.selectedIds = []
            uiState.interaction = 'pending-select'
        }

        uiState.pointerDown = true
        uiState.pointerStart = pointer
        uiState.selectionBox = {
            start: pointer,
            end: pointer,
        }
    }

    const handlePointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
        if (!uiState.pointerDown) return

        if (
            uiState.interaction === 'connecting' ||
            uiState.interaction === 'pending-connect'
        )
            return

        const pointer = stageRef.current?.getRelativePointerPosition()
        if (!pointer) return

        const dx = pointer.x - uiState.pointerStart.x
        const dy = pointer.y - uiState.pointerStart.y

        const distance = Math.sqrt(dx * dx + dy * dy)

        if (
            uiState.interaction === 'pending-drag' &&
            distance > DRAG_THRESHOLD
        ) {
            uiState.interaction = 'dragging-item'
        } else if (
            distance > DRAG_THRESHOLD &&
            uiState.interaction === 'pending-select'
        ) {
            uiState.interaction = 'selecting'
        }

        const activeNode = uiState.activeNode
        if (uiState.interaction === 'dragging-item') {
            if (activeNode && uiState.selectedIds.length <= 1) {
                const itemProxy = diagramHistory.value.items.find(
                    (i) => i.id === activeNode.id,
                )
                if (itemProxy) {
                    itemProxy.x = pointer.x - uiState.dragOffset.x
                    itemProxy.y = pointer.y - uiState.dragOffset.y
                }

                if (isSnapping && itemProxy) {
                    const stage = e.target.getStage()
                    if (!stage) return

                    const layer = stage
                        .getLayers()
                        .find((l) => l.id() === 'preview-layer')
                    if (!layer) return

                    if (!lineXRef.current) {
                        const lineX = new Konva.Line({
                            points: [0, -6000, 0, 6000],
                            stroke: 'rgb(0, 161, 255)',
                            strokeWidth: 1,
                            name: 'guide-line',
                            dash: [4, 6],
                        })
                        layer.add(lineX)
                        lineXRef.current = lineX
                        lineXRef.current.visible(false)
                    }

                    if (!lineYRef.current) {
                        const lineY = new Konva.Line({
                            points: [-6000, 0, 6000, 0],
                            stroke: 'rgb(0, 161, 255)',
                            strokeWidth: 1,
                            name: 'guide-line',
                            dash: [4, 6],
                        })
                        layer.add(lineY)
                        lineYRef.current = lineY
                        lineYRef.current.visible(false)
                    }

                    const geometryX: Geometry = {
                        edges: [
                            { alignment: 'start', value: itemProxy.x },
                            {
                                alignment: 'center',
                                value: itemProxy.x + itemProxy.width / 2,
                            },
                            {
                                alignment: 'end',
                                value: itemProxy.x + itemProxy.width,
                            },
                        ],
                        position: itemProxy.x,
                    }

                    const geometryY: Geometry = {
                        edges: [
                            { alignment: 'start', value: itemProxy.y },
                            {
                                alignment: 'center',
                                value: itemProxy.y + itemProxy.height / 2,
                            },
                            {
                                alignment: 'end',
                                value: itemProxy.y + itemProxy.height,
                            },
                        ],
                        position: itemProxy.y,
                    }

                    const guidesX = [0, stage.width() / 2, stage.width()]
                    const guidesY = [0, stage.height() / 2, stage.height()]

                    const weight = {
                        start: 1,
                        center: 0,
                        end: 1,
                    }

                    diagramHistory.value.items
                        .filter((i) => i.id !== itemProxy.id)
                        .forEach((item) => {
                            const guideX = [
                                item.x,
                                item.x + item.width / 2,
                                item.x + item.width,
                            ]
                            guidesX.push(...guideX)

                            const guideY = [
                                item.y,
                                item.y + item.height / 2,
                                item.y + item.height,
                            ]
                            guidesY.push(...guideY)
                        })

                    if (snapStateRef.current.x) {
                        let edge = 0
                        switch (snapStateRef.current.x.alignment) {
                            case 'start':
                                edge = itemProxy.x
                                break
                            case 'center':
                                edge = itemProxy.x + itemProxy.width / 2
                                break
                            case 'end':
                                edge = itemProxy.x + itemProxy.width
                                break
                        }

                        const distance = Math.abs(
                            edge - snapStateRef.current.x.guide,
                        )

                        if (distance <= SNAP_RANGE.out) {
                            itemProxy.x = snapStateRef.current.x.position

                            lineXRef.current.visible(true)
                            lineXRef.current.absolutePosition({
                                x: snapStateRef.current.x.guide,
                                y: 0,
                            })
                        } else {
                            snapStateRef.current.x = null
                            lineXRef.current.visible(false)
                        }
                    }

                    if (!snapStateRef.current.x) {
                        const snapX: SnapPoint | null = snap(
                            geometryX,
                            guidesX,
                            {
                                in: 5,
                                out: 8,
                            },
                            weight,
                        )
                        if (snapX) {
                            itemProxy.x = snapX.position
                            snapStateRef.current.x = snapX

                            lineXRef.current.visible(true)
                            lineXRef.current.absolutePosition({
                                x: snapX.guide,
                                y: 0,
                            })
                        } else {
                            lineXRef.current.visible(false)
                        }
                    }

                    if (snapStateRef.current.y) {
                        let edge = 0
                        switch (snapStateRef.current.y.alignment) {
                            case 'start':
                                edge = itemProxy.y
                                break
                            case 'center':
                                edge = itemProxy.y + itemProxy.height / 2
                                break
                            case 'end':
                                edge = itemProxy.y + itemProxy.height
                                break
                        }
                        const distance = Math.abs(
                            edge - snapStateRef.current.y.guide,
                        )

                        if (distance <= SNAP_RANGE.out) {
                            itemProxy.y = snapStateRef.current.y.position

                            lineYRef.current.visible(true)
                            lineYRef.current.absolutePosition({
                                x: 0,
                                y: snapStateRef.current.y.guide,
                            })
                        } else {
                            snapStateRef.current.y = null
                            lineYRef.current.visible(false)
                        }
                    }

                    if (!snapStateRef.current.y) {
                        const snapY: SnapPoint | null = snap(
                            geometryY,
                            guidesY,
                            {
                                in: 5,
                                out: 8,
                            },
                            weight,
                        )
                        if (snapY) {
                            itemProxy.y = snapY.position
                            snapStateRef.current.y = snapY

                            lineYRef.current.visible(true)
                            lineYRef.current.absolutePosition({
                                x: 0,
                                y: snapY.guide,
                            })
                        } else {
                            lineYRef.current.visible(false)
                        }
                    }
                }
            }

            if (uiState.selectedIds.length > 1) {
                uiState.activeNode = null
                const dx = pointer.x - uiState.pointerStart.x
                const dy = pointer.y - uiState.pointerStart.y
                diagramHistory.value.items.forEach((item) => {
                    if (!(item.id in uiState.dragStartPositions)) return

                    const start = uiState.dragStartPositions[item.id]

                    item.x = start.x + dx
                    item.y = start.y + dy
                })
            }
        }

        if (uiState.interaction === 'selecting') {
            const selectionBox = uiState.selectionBox
            if (!selectionBox) return

            selectionBox.end = pointer
            const selectionRect: Rect = {
                left: Math.min(selectionBox.start.x, selectionBox.end.x),
                right: Math.max(selectionBox.start.x, selectionBox.end.x),
                top: Math.min(selectionBox.start.y, selectionBox.end.y),
                bottom: Math.max(selectionBox.start.y, selectionBox.end.y),
            }

            const items = stageRef.current?.find('.item')
            if (!items) return

            const intersectedItems = diagramHistory.value.items
                .filter((item) =>
                    intersected(selectionRect, {
                        left: item.x,
                        right: item.x + item.width,
                        top: item.y,
                        bottom: item.y + item.height,
                    }),
                )
                .map((item) => item.id)

            if (intersectedItems.length === 1) {
                uiState.activeNode = {
                    id: items[0].id(),
                    type: 'item',
                }
            } else {
                uiState.selectedIds = intersectedItems
            }
        }
    }

    const handlePointerUp = () => {
        uiState.pointerDown = false
        uiState.selectionBox = null
        uiState.interaction = 'pending-select'

        snapStateRef.current = { x: null, y: null }
        lineXRef.current?.visible(false)
        lineYRef.current?.visible(false)
    }

    return (
        <div
            className="h-full w-full flex gap-2 px-2 py-2 min-h-0"
            onAuxClick={handleMove}
            onContextMenu={(e) => {
                e.preventDefault()
            }}
            onDragOver={(e) => {
                e.preventDefault()
            }}
            onDrop={handleDrop}
        >
            <ComponentPanel />

            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden rounded-lg border focus:outline-none border-gray-300 bg-gray-100 bg-[radial-gradient(#D9D9D9_1px,transparent_1px)] dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] bg-[length:16px_16px]"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
            >
                <Toolbar stageRef={stageRef} />

                <Stage
                    ref={stageRef}
                    width={stage.width}
                    height={stage.height}
                    scaleX={stage.scale}
                    scaleY={stage.scale}
                    onContextMenu={handleContextMenu}
                    //onWheel={handleWheel}
                    draggable={isPanning}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                >
                    <Layer ref={itemLayer}>
                        <Group>
                            {diagramSnap.value.texts.map((text) => {
                                return <TextNode key={text.id} text={text} />
                            })}
                        </Group>

                        <Group>
                            {diagramSnap.value.connections.map(
                                (connection: Connection) => (
                                    <Line
                                        key={connection.id}
                                        connection={connection}
                                    />
                                ),
                            )}
                        </Group>
                        <Group>
                            {diagramSnap.value.items.map((item) => {
                                return <ItemNode key={item.id} item={item} />
                            })}
                        </Group>
                    </Layer>

                    <Layer>
                        <Connector
                            stageRef={stageRef}
                            updatePreview={updatePreview}
                            clearPreview={clearPreview}
                        />
                    </Layer>

                    <Layer id="preview-layer" listening={false}>
                        {connectionPreview}
                    </Layer>

                    <Layer>
                        <Selection selection={uiSnap.selectionBox} />
                        <Transformer ref={selectionRef} />
                    </Layer>
                </Stage>
            </div>

            {contextMenuPosition && (
                <ContextMenu
                    position={contextMenuPosition}
                    onClose={() => setContextMenuPosition(null)}
                />
            )}
        </div>
    )
}

export default DiagramPage
