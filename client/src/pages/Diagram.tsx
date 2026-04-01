import React, { useEffect, useRef, useState } from 'react'

import Konva from 'konva'
import { Layer, Stage, Transformer } from 'react-konva'

import {
    addToStore,
    getAnyFromStore,
    removeFromStore,
} from '@/features/diagram-drawer/store/actions'
import { diagramHistory, uiState } from '@/features/diagram-drawer/store/models'
import { useSnapshot } from 'valtio'

import { Connector } from '@/features/diagram-drawer/canvas/Connector'
import { Item } from '@/features/diagram-drawer/canvas/Item'
import { Line } from '@/features/diagram-drawer/canvas/Line'
import { Selection } from '@/features/diagram-drawer/canvas/Selection'
import Text from '@/features/diagram-drawer/canvas/Text'
import Toolbar from '@/features/diagram-drawer/canvas/Toolbar'
import Actionbar from '@/features/diagram-drawer/ui/Actionbar'
import ComponentPanel from '@/features/diagram-drawer/ui/ComponentPanel'
import ContextMenu from '@/features/diagram-drawer/ui/ContextMenu'

import { useConnectionPreview } from '@/features/diagram-drawer/hooks/useConnectionPreview'

import { useCustomFont } from '@/features/diagram-drawer/hooks/useCustomFont'

import { intersected } from '@/features/diagram-drawer/utils/konva'

import {
    ConnectionType,
    ItemPreview,
    ItemType,
    PointType,
    Rect,
    TextType,
} from '@/features/diagram-drawer/types'

import { KonvaEventObject } from 'konva/lib/Node'
import { KonvaPointerEvent } from 'konva/lib/PointerEvents'

const DiagramPage = () => {
    const stageRef = useRef<Konva.Stage>(null)
    const selectionRef = useRef<Konva.Transformer>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const itemLayer = useRef<Konva.Layer>(null)
    const textLayer = useRef<Konva.Layer>(null)

    const [,] = useCustomFont('Inter')

    const [stage, setStage] = useState({ width: 0, height: 0, scale: 1 })

    const [isPanning, setIsPanning] = useState(false)
    const DRAG_THRESHOLD = 4

    const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
    const [pointer, setPointer] = useState<PointType>({ x: 0, y: 0 })

    const diagramSnap = useSnapshot(diagramHistory)
    const { connectionPreview, updatePreview, clearPreview } =
        useConnectionPreview()

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

    const handleClick = (e: KonvaEventObject<any>) => {
        if (e.target === e.target.getStage()) {
            return
        }

        if (uiState.action != 'delete') uiState.action = null

        if (uiState.action == 'delete') {
            const objectProxy = getAnyFromStore(e.target.id()) as
                | ItemType
                | TextType
                | ConnectionType
            if (!objectProxy) return null
            removeFromStore(objectProxy)
        }

        if (e.target === e.target.getStage()) {
            setShowContextMenu(false)
        }
    }

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

        const newItem: ItemPreview = {
            type: 'items',
            component: dragged.value,
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
            size: 16,
            anchor: {
                type: 'item',
                itemId: addedItem.id,
                placement: 'Top',
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

        setPointer({
            x: containerRect.left + pointerPosition.x + offset,
            y: containerRect.top + pointerPosition.y + offset,
        })

        setShowContextMenu(true)

        console.log('context menu fired', showContextMenu)
        e.cancelBubble = true
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const activeElement = document.activeElement

        if (activeElement?.tagName === 'INPUT') {
            return
        }

        /* This was to not cause issues with the context menu, maybe take deeper look at it later */
        if (
            [
                ' ',
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

        const itemProxy = diagramHistory.value.items.find(
            (i) => i.id === uiState.activeId,
        )

        switch (e.key) {
            case ' ':
                setIsPanning(true)
                const container = stageRef.current?.container()
                if (container) container.style.cursor = 'grab'
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
                uiState.activeId = null
                uiState.action = null
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
    }

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault()

        const stage = stageRef.current
        const oldScale = stage?.scaleX()
        const pointer = stage?.getPointerPosition()

        if (!pointer || !stage || !oldScale) return

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        }

        let direction = e.evt.deltaY < 0 ? 1 : -1

        // for trackpad
        if (e.evt.ctrlKey) {
            direction = -direction
        }

        const scaleBy = 1.01
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

        stage?.scale({ x: newScale, y: newScale })

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        }
        stage?.position(newPos)
    }

    const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
        const stage = e.target.getStage()
        if (!stage) return

        const pointer = stage.getRelativePointerPosition()
        if (!pointer) return

        const itemNode = e.target.findAncestor('.item')

        if (itemNode) {
            if (uiState.selectedIds.includes(itemNode.id())) {
            } else {
                uiState.activeId = itemNode.id()
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
            uiState.activeId = null
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

    const handlePointerMove = () => {
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

        if (uiState.interaction === 'dragging-item') {
            if (uiState.activeId && uiState.selectedIds.length <= 1) {
                const item = diagramHistory.value.items.find(
                    (i) => i.id === uiState.activeId,
                )
                if (item) {
                    item.x = pointer.x - uiState.dragOffset.x
                    item.y = pointer.y - uiState.dragOffset.y
                }
            }

            if (uiState.selectedIds.length > 1) {
                uiState.activeId = null
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
            let selectionRect: Rect = {
                left: Math.min(selectionBox.start.x, selectionBox.end.x),
                right: Math.max(selectionBox.start.x, selectionBox.end.x),
                top: Math.min(selectionBox.start.y, selectionBox.end.y),
                bottom: Math.max(selectionBox.start.y, selectionBox.end.y),
            }

            let items = stageRef.current?.find('.item')
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

            uiState.selectedIds = intersectedItems
        }
    }

    const handlePointerUp = () => {
        uiState.pointerDown = false
        uiState.selectionBox = null
        //uiState.interaction = 'idle'
    }

    console.log(uiState.interaction)
    return (
        <div
            className="h-full flex flex-col-reverse dark:bg-darkBackground"
            onAuxClick={handleMove}
            onContextMenu={(e) => {
                e.preventDefault()
            }}
            onDragOver={(e) => {
                e.preventDefault()
            }}
            onDrop={handleDrop}
        >
            <div
                ref={containerRef}
                className="w-full relative grow bg-[radial-gradient(#D9D9D9_1px,transparent_1px)] dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] bg-[length:16px_16px]"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
            >
                <Actionbar stage={stageRef} />

                <ComponentPanel />
                <Toolbar stage={stageRef} />

                <Stage
                    ref={stageRef}
                    width={stage.width}
                    height={stage.height}
                    scaleX={stage.scale}
                    scaleY={stage.scale}
                    onContextMenu={handleContextMenu}
                    onClick={handleClick}
                    onWheel={handleWheel}
                    draggable={isPanning}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                >
                    <Layer ref={itemLayer}>
                        {diagramSnap.value.items.map((item) => {
                            return <Item key={item.id} item={item} />
                        })}
                    </Layer>

                    <Layer listening={false}>
                        {diagramSnap.value.connections.map((connection) => (
                            <Line key={connection.id} connection={connection} />
                        ))}
                    </Layer>

                    <Layer>
                        <Connector
                            stageRef={stageRef}
                            updatePreview={updatePreview}
                            clearPreview={clearPreview}
                        />
                    </Layer>

                    <Layer ref={textLayer}>
                        {diagramSnap.value.texts.map((text) => {
                            return <Text key={text.id} parent={text} />
                        })}
                    </Layer>

                    <Layer listening={false}>{connectionPreview}</Layer>

                    <Layer>
                        <Selection selection={uiSnap.selectionBox} />
                        <Transformer ref={selectionRef} />
                    </Layer>
                </Stage>
                {showContextMenu && (
                    <ContextMenu
                        position={pointer}
                        onClose={() => setShowContextMenu(false)}
                    />
                )}
            </div>
        </div>
    )
}

export default DiagramPage
