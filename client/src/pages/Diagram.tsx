import React, { useEffect, useRef, useState } from 'react'

import { Stage, Layer } from 'react-konva'
import Konva from 'konva'

import { useSnapshot } from 'valtio'
import {
    getFromStore,
    addToStore,
    removeFromStore,
    diagramHistory,
    uiState,
} from '@/features/diagram-drawer/store'

import ComponentPanel from '@/features/diagram-drawer/ui/ComponentPanel'
import { Item } from '@/features/diagram-drawer/canvas/Item'
import { Connector } from '@/features/diagram-drawer/canvas/Connector'
import { Line } from '@/features/diagram-drawer/canvas/Line'
import Toolbar from '@/features/diagram-drawer/canvas/Toolbar'
import ContextMenu from '@/features/diagram-drawer/ui/ContextMenu'
import Actionbar from '@/features/diagram-drawer/ui/Actionbar'
import Text from '@/features/diagram-drawer/canvas/Text'

import { useCustomFont } from '@/features/diagram-drawer/hooks/useCustomFont'

import {
    PointType,
    ItemPreview,
    ItemType,
    TextType,
    ConnectionType,
} from '@/features/diagram-drawer/types'

import { KonvaEventObject } from 'konva/lib/Node'
import { KonvaPointerEvent } from 'konva/lib/PointerEvents'

const DiagramPage = () => {
    const stageRef = useRef<Konva.Stage>(null)
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
        if (!e.target.id()) uiState.selected = null

        if (uiState.action != 'delete') uiState.action = null

        if (uiState.action == 'delete') {
            const objectProxy = getFromStore(e.target.id()) as
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

        if (!stageRef.current) return null

        const stage = stageRef.current
        stage.setPointersPositions(e)

        const position = stage.getPointerPosition()
        const dragged = uiState.dragged

        if (!position || !dragged) return null

        const newItem: ItemPreview = {
            type: 'items',
            component: dragged.value,
            height: dragged.height,
            width: dragged.width,
            x: position.x - dragged.width / 2,
            y: position.y - dragged.height / 3,
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
            (i) => i.id === uiState.selected?.id,
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

    const handlePointerMove = () => {
        if (!uiState.pointerDown) return

        const pointer = stageRef.current?.getPointerPosition()
        if (!pointer) return

        const dx = pointer.x - uiState.pointerStart.x
        const dy = pointer.y - uiState.pointerStart.y

        const distance = Math.sqrt(dx * dx + dy * dy)

        if (!uiState.dragging && distance > DRAG_THRESHOLD) {
            uiState.dragging = true
        }

        if (!uiState.dragging) return

        uiState.shadowPosition = {
            x: pointer.x - uiState.dragOffset.x,
            y: pointer.y - uiState.dragOffset.y,
        }
    }

    const handlePointerUp = () => {
        if (uiState.dragging && uiState.selected) {
            const item = diagramHistory.value.items.find(
                (i) => i.id === uiState.selected.id,
            )
            if (item) {
                item.x = uiState.shadowPosition.x
                item.y = uiState.shadowPosition.y
            }
        }

        uiState.pointerDown = false
        uiState.dragging = false
    }

    console.log(uiState.dragging)

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
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                >
                    <Layer>
                        {diagramSnap.value.connections.map((connection) => {
                            return (
                                <Line
                                    key={connection.id}
                                    connection={connection}
                                />
                            )
                        })}
                    </Layer>

                    <Layer ref={itemLayer}>
                        {diagramSnap.value.items.map((item) => {
                            return <Item key={item.id} item={item} />
                        })}
                    </Layer>

                    <Layer ref={textLayer}>
                        {diagramSnap.value.texts.map((text) => {
                            return <Text key={text.id} parent={text} />
                        })}
                    </Layer>

                    <Connector stageRef={stageRef} />
                </Stage>
                {showContextMenu && <ContextMenu position={pointer} />}
            </div>
        </div>
    )
}

export default DiagramPage
