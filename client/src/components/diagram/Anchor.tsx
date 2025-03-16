import { useRef, useEffect } from 'react'
import Konva from 'konva'
import { Circle } from 'react-konva'

const dragBounds = (ref: React.RefObject<Konva.Circle>) => {
  if (ref.current !== null) {
    return ref.current.getAbsolutePosition()
  }
  return { x: 0, y: 0 }
}

type PropsType = {
  x: number
  y: number
  id: string
  hovered: string
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>, id: string | number) => void
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>, id: string | number) => void
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>, id: string | number) => void
}

export const Anchor = ({ x, y, id, hovered, onDragMove, onDragStart, onDragEnd }: PropsType) => {
  const anchor = useRef<Konva.Circle>(null)
  const hover = useRef<Konva.Circle>(null)

  useEffect(() => {
    if (hovered === id) {
      hover.current?.to({
        radius: 9,
        duration: 0.2,
        easing: Konva.Easings.EaseIn
      })
    } else {
      hover.current?.to({
        radius: 5,
        duration: 0.2,
        easing: Konva.Easings.EaseOut
      })
    }
  }, [hovered])

  return (
    <>
      <Circle
        id={id}
        x={x}
        y={y}
        radius={5}
        fill='#E83F6F'
        opacity={0.5}
        visible={hovered === id}
        ref={hover}
      />

      <Circle
        id={id}
        x={x}
        y={y}
        radius={5}
        fill='#E83F6F'
        draggable
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container()
          if (!container) return

          container.style.cursor = "crosshair"
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container()
          if (!container) return

          container.style.cursor = "default"
        }}
        onDragStart={(e) => onDragStart(e, id)}
        onDragMove={(e) => onDragMove(e, id)}
        onDragEnd={(e) => onDragEnd(e, id)}
        dragBoundFunc={() => dragBounds(anchor)}
        perfectDrawEnabled={false}
        name='anchor'
        ref={anchor}
      />

    </>
  )
}
