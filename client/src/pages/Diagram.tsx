import React, { MouseEvent, useEffect, useRef, useState } from 'react'

import { Stage, Layer } from 'react-konva'
import Konva from 'konva'

import { useSnapshot } from 'valtio'
import { store } from '@/store'

import ComponentPanel from '@/components/diagram/ComponentPanel'
import { Item } from '@/components/diagram/Item'
import { Connector } from '@/components/diagram/Connector'
import { Line } from '@/components/diagram/Line'
import Toolbar from '@/components/diagram/Toolbar'
import ContextMenu from '@/components/diagram/ContextMenu'

import { useCustomFont } from '@/hooks/useCustomFont'
import { useAddToStore } from '@/hooks/useAddToStore'

import { PointType } from '@/common/types'

import { KonvaEventObject } from 'konva/lib/Node'
import { ItemPreview } from '@/common/types'
import Actionbar from '@/components/diagram/Actionbar'
import { KonvaPointerEvent } from 'konva/lib/PointerEvents'

const DiagramPage = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemLayer = useRef<Konva.Layer>(null)

  const [,] = useCustomFont('Open Sans')

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
        height: clientHeight
      })
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const handleClick = (e: KonvaEventObject<Konva.KonvaPointerEvent>) => {
    if (!e.target.id())
      store.selected = null

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

    let newItem: ItemPreview = {
      type: "items",
      component: dragged.value,
      height: dragged.height,
      width: dragged.width,
      x: position.x - dragged.width / 2,
      y: position.y - dragged.height / 2,
      locked: false,
      img: dragged.img
    }

    useAddToStore(newItem)
    newItem = null
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
      y: containerRect.top + pointerPosition.y + offset
    })

    setShowContextMenu(true)
    e.cancelBubble = true
    console.log(pointer.x)
    console.log(showContextMenu)
  }

  return (
    <div className='h-full flex flex-col-reverse dark:bg-darkBackground'
      onAuxClick={handleMove}
      onContextMenu={(e) => { e.preventDefault() }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >


      <div ref={containerRef} className="w-full relative grow bg-[radial-gradient(#D9D9D9_1px,transparent_1px)] dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] bg-[length:16px_16px]">
        <Actionbar />
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
        >
          <Layer ref={itemLayer}>
            {snap.items
              .map((item) => {
                return (
                  <Item key={item.id} item={item} />
                )
              }
              )}

            {snap.connections
              .map((connection) => {
                return (
                  <Line key={connection.id} connection={connection} />
                )
              })}
          </Layer>

          <Connector stageRef={stageRef} selected={snap.selected} />
        </Stage>
        {showContextMenu && (
          <ContextMenu position={pointer} />
        )}
      </div>
    </div>
  )
}

export default DiagramPage
