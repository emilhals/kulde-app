import { useEffect, useRef, useState } from 'react'

import { Group, Rect, Text } from "react-konva"

import { ItemType } from "@/common/types"

import { store } from '@/store'

export const Item = ({ item }: { item: ItemType }) => {
  const groupRef = useRef<typeof Group>(null)
  const itemRef = useRef<typeof Rect | null>(null)

  const [itemState, setItemState] = useState<ItemType>()

  /* 
   * component mounted 
   */
  useEffect(() => {
    /* center text */
    if (!groupRef.current) return
    let text = groupRef.current.find(".text")

  }, [groupRef])

  const handleClick = (e: any) => {
    const item = store.items.find((item) => item.id === e.target.id())
    if (!item) return
    setItemState(item)
  }

  const handleDragMove = (e: any) => {
    if (!itemState) return

    itemState.x = e.target.x()
    itemState.y = e.target.y()
  }

  return (
    <>
      <Group ref={groupRef}>
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

        <Text
          draggable
          fontSize={16}
          fontStyle="400"
          text={item.label}
          x={item.x + item.textXOffset}
          y={item.y + item.textYOffset}
          name="text"
        />
      </Group>
    </>
  )
}
