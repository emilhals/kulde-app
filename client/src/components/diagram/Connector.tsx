import { Line, Rect, Layer } from 'react-konva'
import Konva from 'konva'

import React, { useRef, useState } from 'react'

import { useSnapshot } from 'valtio'

import { store } from '@/store'
import { PointType } from '@/common/types'
import { PointsMaterial } from 'three'

export const Connector = ({ stageRef, layerRef }: { stageRef: React.RefObject<Konva.Stage>, layerRef: React.RefObject<Konva.Layer> }) => {
  const overlayRef = useRef<Konva.Rect>(undefined)

  const snap = useSnapshot(store)

  const [connectionPreview, setConnectionPreview] = useState<Konva.Line>()
  const [connecting, setConnecting] = useState<boolean>(false)

  const SIZE = 50;
  const points = [0, 0, SIZE, 0, SIZE, SIZE, 0, SIZE, 0, 0]

  const createConnectionPoints = (source: PointType, destination: PointType) => {
    return [source.x, source.y, destination.x, destination.y]
  }

  const handleMouseDown = (e: any) => {
    const pointer = stageRef.current?.getPointerPosition()
    if (!pointer) return

    let selectedId = layerRef.current?.getIntersection(pointer)?.id()
    let item = snap.items.find((item) => item.id === selectedId)
    if (!item) return

    setConnectionPreview(
      <Line
        strokeWidth={2}
        stroke="black"
        perfectDrawEnabled={false}
        points={createConnectionPoints(item, item)}
      />
    )
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const pointer = e.target.getStage()?.getPointerPosition()
    if (!pointer) return

    let selectedId = layerRef.current?.getIntersection(pointer)?.id()
    let item = snap.items.find((item) => item.id === selectedId)
    if (!item) return

    setConnectionPreview(
      <Line
        strokeWidth={2}
        stroke="black"
        perfectDrawEnabled={false}
        points={createConnectionPoints(item, pointer)}
      />
    )
  }

  const handleClick = () => {
    const pointer = stageRef.current?.getPointerPosition()
    if (!pointer) return

    let selectedId = layerRef.current?.getIntersection(pointer)?.id()
    let item = snap.items.find((item) => item.id === selectedId)
    if (!item) return
  }

  return (
    <Layer>
      <Rect
        ref={overlayRef}
        width={stageRef.current?.width()}
        height={stageRef.current?.height()}
        fill="transparent"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}

      />
      {connectionPreview}
    </Layer>
  )
}
