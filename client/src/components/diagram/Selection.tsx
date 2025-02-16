import { useEffect, useState, useRef } from 'react'
import { Rect } from 'react-konva'
import Konva from 'konva'

import { SelectionType } from '@/common/types'

export const Selection = (selection: { selection: SelectionType }) => {

  const [size, setSize] = useState({
    width: 1,
    height: 1
  })


  useEffect(() => {
    setSize({
      width: Math.abs(selection.x2 - selection.x1),
      height: Math.abs(selection.y2 - selection.y1)
    })
  }, [selection.height])

  return (
    <div>
      <Rect
        visible={selection.show}
        listening={false}
        fill="blue"
        opacity={0.4}
        x={selection.x}
        y={selection.y}
        height={size.height}
        width={size.width}
        name="shadow"
        cornerRadius={8}
      />
    </div>
  )
}
