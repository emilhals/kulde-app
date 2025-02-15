import { useEffect, useRef, useState } from 'react'

import { Group, Rect } from 'react-konva'
import Konva from 'konva'

import { ItemType } from '@/common/types'

import { Text } from '@/components/diagram/Text'

import { store } from '@/store'

import { useDeleteFromStore } from '@/hooks/useDeleteFromStore'

export const Item = ({ item }: { item: ItemType }) => {
  const groupRef = useRef<Konva.Group>(null)
  const itemRef = useRef<Konva.Rect>(null)

  const [itemState, setItemState] = useState<ItemType>()

  /*
   * item loaded
   */
  useEffect(() => {
    /* get current item from valtio store on mount*/
    if (!itemRef.current) return

    const item = store.items.find((item) => item.id === itemRef.current?.id())
    if (!item) return
    setItemState(item)

  }, [itemRef])

  const handleOnPointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const item = store.items.find((item) => item.id === e.target.id())
    if (!item) return
    setItemState(item)
  }

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!itemState) return

    itemState.x = e.target.x()
    itemState.y = e.target.y()
  }

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!itemState) return

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
          x={item.x}
          y={item.y}
          draggable
          onDblClick={() => { useDeleteFromStore(item.id) }}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          height={item.height}
          width={item.width}
          name="object"
        />
        <Text item={item} />

      </Group>
    </>
  )
}
