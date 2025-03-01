import { useEffect, useRef, useState } from 'react'

import useImage from 'use-image'

import { Group, Rect, Image } from 'react-konva'
import Konva from 'konva'

import { ItemType, PointType } from '@/common/types'
import { Text } from '@/components/diagram/Text'

import { store } from '@/store'

export const Item = ({ item }: { item: ItemType }) => {
  const groupRef = useRef<Konva.Group>(null)
  const itemRef = useRef<Konva.Image>(null)
  const shadowRef = useRef<Konva.Rect>(null)

  const [itemState, setItemState] = useState<ItemType>()
  const [shadowPosition, setShadowPosition] = useState<PointType>({ x: item.x, y: item.y })

  const [image] = useImage(item.img)

  const handleOnPointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const item = store.items.find((item) => item.id === e.target.id())
    if (!item) return
    setItemState(item)

    shadowRef.current?.show()
    setShadowPosition({
      x: Math.round(e.target.x() / 16) * 16,
      y: Math.round(e.target.y() / 16) * 16
    })
  }

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!itemState) return

    shadowRef.current?.show()
    setShadowPosition({
      x: Math.round(e.target.x() / 16) * 16,
      y: Math.round(e.target.y() / 16) * 16
    })

    itemState.x = e.target.x()
    itemState.y = e.target.y()
  }

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!itemState) return

    shadowRef.current?.hide()

    /* snap to dot-grid */
    itemState.x = Math.round(e.target.x() / 16) * 16
    itemState.y = Math.round(e.target.y() / 16) * 16

    setShadowPosition({
      x: Math.round(e.target.x() / 16) * 16,
      y: Math.round(e.target.y() / 16) * 16
    })
  }

  return (
    <Group ref={groupRef} onPointerDown={handleOnPointerDown}>
      <Rect
        ref={shadowRef}
        fill="blue"
        visible={false}
        opacity={0.4}
        x={shadowPosition.x}
        y={shadowPosition.y}
        height={item.height}
        width={item.width}
        name="shadow"
        cornerRadius={8}
      />
      <Image
        ref={itemRef}
        id={item.id}
        key={item.id}
        image={image}
        x={item.x}
        y={item.y}
        draggable
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        height={item.height}
        width={item.width}
        cornerRadius={8}
        name="object"
      />
      <Text parent={item} />
    </Group>

  )
}
