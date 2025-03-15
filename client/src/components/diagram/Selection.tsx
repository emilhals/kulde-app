import { useState, useRef, useContext } from 'react'
import { Rect, Layer } from 'react-konva'
import Konva from 'konva'

import { ActionContext } from '@/common/Providers'
import { SelectionType } from '@/common/types'
import { ACTIONS } from '@/common/constants'

export const Selection = ({ stageRef, transformerRef }: { stageRef: React.RefObject<Konva.Stage>, transformerRef: React.RefObject<Konva.Transformer> }) => {

  /*
   * TODO: sjekk om dette er beste løsning
   *
  /* don't do anything from this component if action is not set to select */
  const actionContext = useContext(ActionContext)
  if (actionContext?.action !== ACTIONS.SELECT) return

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
    const pointer = stageRef.current?.getPointerPosition()
    if (!pointer) return

    selection.current.x1 = pointer.x
    selection.current.y1 = pointer.y
    selection.current.x2 = pointer.x
    selection.current.y2 = pointer.y

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
    setSelecting(false)
    e.evt.preventDefault()

    selectRef.current?.setAttrs({ visible: false })

    let shapes = stageRef.current?.find('.object')
    let box = selectRef.current?.getClientRect()
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
    <Layer>
      <Rect
        ref={selectRef}
        listening={false}
        visible={false}
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
        onClick={handleClick}
      />
    </Layer>
  )
}
