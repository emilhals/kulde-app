import { useState, useRef } from 'react'
import { Rect, Group } from 'react-konva'
import Konva from 'konva'

import { SelectionType } from '@/common/types'

export const Selection = ({ stageRef, transformerRef }: { stageRef: React.RefObject<Konva.Stage>, transformerRef: React.RefObject<Konva.Transformer> }) => {
  const selectRef = useRef<Konva.Rect>(null)

  const overlayRef = useRef<Konva.Rect>(null)

  const [selecting, setSelecting] = useState<boolean>(false)
  const selection = useRef<SelectionType>({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
  })

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const pointer = stageRef.current?.getPointerPosition()
    if (!pointer) return
    e.evt.preventDefault()

    selection.current.x1 = pointer.x
    selection.current.y1 = pointer.y
    selection.current.x2 = pointer.x
    selection.current.y2 = pointer.y

    setSelecting(true)
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    const pointer = stage?.getPointerPosition()

    if (!pointer) return
    if (!selecting) return

    e.evt.preventDefault()

    selection.current.x2 = pointer.x
    selection.current.y2 = pointer.y

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
    setSelecting(false)
    e.evt.preventDefault()


    if (!selectRef.current) return

    selectRef.current?.visible(false)

    let shapes = stageRef.current?.find('.object')
    let box = selectRef.current.getClientRect()
    let selected = shapes?.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    )
    if (!selected) return
    transformerRef.current?.nodes(selected)
  }

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (selectRef.current?.visible()) return

    if (e.target === stageRef.current) {
      transformerRef.current?.nodes([])
      return
    }

    if (!e.target.hasName('.object')) return
  }

  return (
    <Group>
      <Rect
        ref={selectRef}
        listening={false}
        visible={false}
        fill="#E83F6F"
        opacity={0.4}
        name="select"
      />
      <Rect
        ref={overlayRef}
        width={stageRef.current?.width()}
        height={stageRef.current?.height()}
        fill="transparent"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
      />
    </Group>
  )
}
