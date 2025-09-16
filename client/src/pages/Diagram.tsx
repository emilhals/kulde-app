import React, {
  KeyboardEventHandler,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

import { Stage, Layer } from 'react-konva'
import Konva from 'konva'

import { useSnapshot } from 'valtio'
import { store } from '@/features/diagram-drawer/store'

import ComponentPanel from '@/features/diagram-drawer/ui/ComponentPanel'
import { Item } from '@/features/diagram-drawer/canvas/Item'
import { Connector } from '@/features/diagram-drawer/canvas/Connector'
import { Line } from '@/features/diagram-drawer/canvas/Line'
import Toolbar from '@/features/diagram-drawer/canvas/Toolbar'
import ContextMenu from '@/features/diagram-drawer/canvas/ContextMenu'
import Actionbar from '@/features/diagram-drawer/canvas/Actionbar'

import { v4 as uuidv4 } from 'uuid'

import { useCustomFont } from '@/features/diagram-drawer/hooks/useCustomFont'

import {
  PointType,
  ItemPreview,
  ItemType,
  TextType,
  TextPreview,
} from '@/features/diagram-drawer/types'

import { KonvaEventObject } from 'konva/lib/Node'
import { KonvaPointerEvent } from 'konva/lib/PointerEvents'

const DiagramPage = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemLayer = useRef<Konva.Layer>(null)

  const [,] = useCustomFont('Inter')

  const [stage, setStage] = useState({ width: 0, height: 0, scale: 1 })

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false)
  const [pointer, setPointer] = useState<PointType>({ x: 0, y: 0 })

  const snap = useSnapshot(store)

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
    if (!e.target.id()) store.selected = null

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
    if (!stageRef.current) return

    const stage = stageRef.current
    stage.setPointersPositions(e)

    const position = stage.getPointerPosition()
    const dragged = store.dragged

    if (!position || !dragged) return

    const newText: TextType = {
      id: uuidv4(),
      type: 'texts',
      content: '',
      position: { x: 0, y: 0 },
      size: 16,
    }

    const newItem: ItemType = {
      id: uuidv4(),
      type: 'items',
      component: dragged.value,
      height: dragged.height,
      width: dragged.width,
      x: position.x - dragged.width / 2,
      y: position.y - dragged.height / 2,
      locked: false,
      anchors: dragged.anchors,
      text: newText,
    }

    store.items.push(newItem)
    store.texts.push(newText)

    store.dragged = null
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
      return null
    }

    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault()
    } else {
      return null
    }

    if (!store.selected) return null

    const itemProxy = store.items.find((i) => i.id === store.selected?.id)
    if (!itemProxy) return null

    switch (e.key) {
      case 'ArrowRight':
        itemProxy.x += 4
        break
      case 'ArrowLeft':
        itemProxy.x -= 4
        break
      case 'ArrowUp':
        itemProxy.y -= 4
        break
      case 'ArrowDown':
        itemProxy.y += 4
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
        <Actionbar />
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
          <Layer>
            {snap.connections.map((connection) => {
              return <Line key={connection.id} connection={connection} />
            })}
          </Layer>

          <Layer ref={itemLayer}>
            {snap.items.map((item) => {
              return <Item key={item.id} item={item} />
            })}
          </Layer>

          <Connector stageRef={stageRef} selected={snap.selected} />
        </Stage>
        {showContextMenu && <ContextMenu position={pointer} />}
      </div>
    </div>
  )
}

export default DiagramPage
