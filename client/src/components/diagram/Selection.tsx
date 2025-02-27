import { useEffect, useState, useRef } from 'react'
import { Rect, Layer } from 'react-konva'

import { SelectionType } from '@/common/types'

export const Selection = ({ selection }) => {

  const selectRef = useRef()

  const node = selectRef.current
  if (!node) {
    console.log("no node")
    return
  }

  node.setAttrs({
    visible: true,
    x: Math.min(selection.current.x1, selection.current.x2),
    y: Math.min(selection.current.y1, selection.current.y2),
    width: Math.abs(selection.current.x1 - selection.current.x2),
    height: Math.abs(selection.current.y1 - selection.current.y2),
  })

  console.log("width", node.width())
  node.getLayer().batchDraw()

  return (
    <Rect
      ref={selectRef}
      visible={false}
      listening={false}
      fill="blue"
      opacity={0.4}
      name="select"
      cornerRadius={8}
    />
  )
}
