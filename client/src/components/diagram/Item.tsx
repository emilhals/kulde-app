import React, { useEffect, useRef, useState } from 'react'

import { Group, Rect } from 'react-konva'
import Konva from 'konva'

import { ItemType } from '@/common/types'

import { Text } from '@/components/diagram/Text'

import { store } from '@/store'

export const Item = ({ item }: { item: ItemType }) => {
  const groupRef = useRef<typeof Group>(null)
  const itemRef = useRef<HTMLDivElement>(null)

  const [itemState, setItemState] = useState<ItemType>()

  /*
   * component mounted 
   */
  useEffect(() => {
    /* get current item from valtio store on mount*/
    if (!itemRef.current) return

    const item = store.items.find((item) => item.id === itemRef.current.id())
    if (!item) return
    setItemState(item)

  }, [itemRef])

  const handleClick = (e: any) => {
  }

  const handleOnPointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const item = store.items.find((item) => item.id === e.target.id())
    if (!item) return
    setItemState(item)
  }

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!itemState) return

    console.log(itemState.label)
    itemState.x = e.target.x()
    itemState.y = e.target.y()
  }

  return (
    <>
      <Group ref={groupRef} onPointerDown={handleOnPointerDown}>
        <Rect
          ref={itemRef}
          id={item.id}
          key={item.id}
          fill="black"
          x={50}
          y={50}
          draggable
          onClick={handleClick}
          onDragMove={handleDragMove}
          height={item.height}
          width={item.width}
          name="object"
        />
        <Text item={item} />

      </Group>
    </>
  )
}
