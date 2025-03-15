import React, { useRef, useState } from 'react'

import { Line, Rect, Layer } from 'react-konva'
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { KonvaPointerEvent } from 'konva/lib/PointerEvents'

import { useSnapshot } from 'valtio'
import { store } from '@/store'

import { PointType, ItemType, ConnectionType } from '@/common/types'
import { Border } from './Border'

import { useAddToStore } from '@/hooks/useAddToStore'

import { createConnectionPoints, hasIntersection } from '@/lib/utils'

let connection = {
  id: '',
  from: null,
  to: null,
  offset: null
}

export const Connector = ({ stageRef, layerRef }: { stageRef: React.RefObject<Konva.Stage>, layerRef: React.RefObject<Konva.Layer> }) => {
  const overlayRef = useRef<Konva.Rect>(null)

  const [selected, setSelected] = useState<ItemType>()
  const [selected2, setSelected2] = useState<ItemType>()

  const snap = useSnapshot(store)

  const [connectionPreview, setConnectionPreview] = useState<React.ReactNode>()

  const detectConnection = (position: PointType, target) => {
    let selectedId = layerRef.current?.getIntersection(position)?.id()

    let obj = stageRef.current?.find('#' + selectedId)

    if (selectedId !== undefined) {
      console.log(selectedId)

      let item = snap.items.find((item) => item.id === selectedId)

      setSelected2(item)

      console.log(selected2)
    }
    return null
  }

  const handleClick = () => {
    const pointer = stageRef.current?.getPointerPosition()
    if (!pointer) return

    let selectedId = layerRef.current?.getIntersection(pointer)?.id()
    let item = snap.items.find((item) => item.id === selectedId)
    if (!item) return

    setSelected(item)
  }

  const handleAnchorDragStart = (e: KonvaEventObject<KonvaPointerEvent>) => {
    const position = e.target.position()

    let item = snap.items.find((item) => item.id === selected?.id)
    if (!item) return

    connection.from = item

    setConnectionPreview(
      <Line
        x={position.x}
        y={position.y}
        points={[position.x, position.y, position.x, position.y]}
        strokeWidth={2.5}
        stroke="blue"
        perfectDrawEnabled={false}
      />
    )
  }

  const handleAnchorDragMove = (e: KonvaEventObject<KonvaPointerEvent>) => {
    let position = e.target.position();
    let stage = e.target.getStage();
    let pointerPosition = stage?.getPointerPosition();

    if (!pointerPosition) return
    let mousePosition = {
      x: pointerPosition.x - position.x,
      y: pointerPosition.y - position.y
    }

    /* which anchor is clicked? top, right, left or bottom? */
    let clickedAnchor = e.target.id()
    let anchorPosition = stageRef.current?.find('#' + clickedAnchor)[0].position()

    const connectionTo = detectConnection(pointerPosition, e.target.getClientRect())

    setConnectionPreview(
      <Line
        x={position.x}
        y={position.y}
        points={createConnectionPoints(anchorPosition, clickedAnchor, mousePosition)}
        strokeWidth={2.5}
        stroke="blue"
        perfectDrawEnabled={false}
      />
    )
  }
  const handleAnchorDragEnd = (e: KonvaEventObject<KonvaPointerEvent>) => {
    setConnectionPreview(null)
    const stage = e.target.getStage()
    const mousePosition = stage?.getPointerPosition()
    const connectionTo = detectConnection(mousePosition)

    let item = snap.items.find((item) => item.id === connectionTo)
    if (!item) return

    connection.to = item

    useAddToStore('connection', connection)
  }


  const border =
    selected !== null ? (
      <Border
        item={selected}
        color="blue"
        onAnchorDragEnd={(e) => handleAnchorDragEnd(e)}
        onAnchorDragMove={handleAnchorDragMove}
        onAnchorDragStart={handleAnchorDragStart}
      />
    ) : null

  const border2 =
    selected2 !== null ? (
      <Border
        item={selected}
        color="red"
      />
    ) : null

  return (
    <Layer>
      <Rect
        ref={overlayRef}
        width={stageRef.current?.width()}
        height={stageRef.current?.height()}
        fill="transparent"
        onClick={handleClick}
      />
      {border2}
      {border}
      {connectionPreview}
    </Layer>
  )
}
