import React, { MouseEvent, useEffect, useRef, useState } from 'react'

import { Stage, Layer, Transformer } from 'react-konva'
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
  TextPreview,
  ConnectionType,
} from '@/features/diagram-drawer/types'

import { KonvaEventObject } from 'konva/lib/Node'
import { KonvaPointerEvent } from 'konva/lib/PointerEvents'
import { Selection } from '@/features/diagram-drawer/canvas/Selection'

const DiagramPage = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const transformerRef = useRef<Konva.Transformer>(null)

  const itemLayer = useRef<Konva.Layer>(null)
  const textLayer = useRef<Konva.Layer>(null)

  const [,] = useCustomFont('Inter')

  const [stage, setStage] = useState({ width: 0, height: 0, scale: 1 })

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
  const [pointer, setPointer] = useState<PointType>({ x: 0, y: 0 })

  const diagramSnap = useSnapshot(diagramHistory)
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

  const handleClick = (e: KonvaEventObject<Konva.KonvaPointerEvent>) => {
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

  const handleMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 1) {
      e.preventDefault()
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (!stageRef.current) return

    const stage = stageRef.current
    stage.setPointersPositions(e)

    const position = stage.getPointerPosition()
    const dragged = uiState.dragged

    if (!position || !dragged) return

    const newText: TextPreview = {
      type: 'texts',
      content: '',
      position: {
        x: position.x - dragged.width / 2,
        y: position.y - dragged.height / 2,
      },
      size: 16,
    }

    const addedText = addToStore(newText)

    const newItem: ItemPreview = {
      type: 'items',
      component: dragged.value,
      height: dragged.height,
      width: dragged.width,
      x: position.x - dragged.width / 2,
      y: position.y - dragged.height / 3,
      locked: false,
      anchors: dragged.anchors,
      text: addedText,
    }

    addToStore(newItem)
    uiState.dragged = null
  }

  const handleDragOver = (e) => {
    e.preventDefault()
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

  const handleKeyDown = (e: KeyboardEvent) => {
    const activeElement = document.activeElement

    if (activeElement?.tagName === 'INPUT') {
      console.log('return')
      return null
    }

    if (
      ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Escape'].includes(
        e.key,
      )
    ) {
      e.preventDefault()
    } else {
      return null
    }

    const itemProxy = diagramHistory.value.items.find(
      (i) => i.id === uiState.selected?.id,
    )

    switch (e.key) {
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

  return (
    <div
      className="h-full flex flex-col-reverse dark:bg-darkBackground"
      onAuxClick={handleMove}
      onContextMenu={(e) => {
        e.preventDefault()
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        ref={containerRef}
        className="w-full relative grow bg-[radial-gradient(#D9D9D9_1px,transparent_1px)] dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] bg-[length:16px_16px]"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <Actionbar stage={stageRef} />
        <Toolbar stage={stageRef} />

        <ComponentPanel />

        <Stage
          ref={stageRef}
          width={stage.width}
          height={stage.height}
          scaleX={stage.scale}
          scaleY={stage.scale}
          onContextMenu={handleContextMenu}
          onClick={handleClick}
        >
          <Layer key={`connections-${diagramSnap.value.connections.length}`}>
            {diagramSnap.value.connections.map((connection) => {
              return <Line key={connection.id} connection={connection} />
            })}
          </Layer>

          <Layer
            key={`items-${diagramSnap.value.items.length}`}
            ref={itemLayer}
          >
            {diagramSnap.value.items.map((item) => {
              return <Item key={item.id} item={item} />
            })}
          </Layer>

          <Layer
            key={`texts-${diagramSnap.value.texts.length}`}
            ref={textLayer}
          >
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
