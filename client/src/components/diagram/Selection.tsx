import { useState, useRef } from 'react'
import { Rect } from 'react-konva'
import Konva from 'konva'

import { SelectionType } from '@/common/types'

export const Selection = ({ stageRef, transformerRef }: { stageRef: React.RefObject<Konva.Stage>, transformerRef: React.RefObject<Konva.Transformer> }) => {
  const selectRef = useRef<Konva.Rect>(null)

  const [selecting, setSelecting] = useState<boolean>(false)
  const selection = useRef<SelectionType>({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
    show: false,
    moving: false
  })

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== stageRef.current) return
    console.log("hello")

    const pointer = stageRef.current?.getPointerPosition()
    if (!pointer) return
    selection.current.x1 = pointer.x
    selection.current.y1 = pointer.y
    selection.current.x2 = pointer.x
    selection.current.y2 = pointer.y
    selection.current.show = true
    setSelecting(true)
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault()

    const stage = e.target.getStage()
    const pointer = stage?.getPointerPosition()

    if (!pointer) return
    if (!selecting) return

    selection.current.x2 = pointer.x
    selection.current.y2 = pointer.y
    selection.current.moving = true

    const node = selectRef.current
    if (!node) return

    node.setAttrs({
      visible: true,
      x: Math.min(selection.current.x1, selection.current.x2),
      y: Math.min(selection.current.y1, selection.current.y2),
      width: Math.abs(selection.current.x1 - selection.current.x2),
      height: Math.abs(selection.current.y1 - selection.current.y2),
    })
  }


  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault()
    setSelecting(false)

    const node = selectRef.current
    if (!node) return
    node.setAttrs({ visible: false })

    let shapes = stageRef.current?.find('.object')
    let box = node.getClientRect()
    let selected = shapes?.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    )
    if (!selected) return
    transformerRef.current?.nodes(selected)
  }
  return (
    <>
      <Rect
        ref={selectRef}
        listening={false}
        fill="blue"
        opacity={0.4}
        name="select"
      />
      <Rect
        width={stageRef.current?.width()}
        height={stageRef.current?.height()}
        fill="transparent"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  )
}
