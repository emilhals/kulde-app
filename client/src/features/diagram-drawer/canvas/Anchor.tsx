import { useRef, useEffect } from 'react'
import Konva from 'konva'
import { Circle } from 'react-konva'
import { PlacementType } from '../types'

const dragBounds = (ref: React.RefObject<Konva.Circle>) => {
  if (ref.current !== null) {
    return ref.current.getAbsolutePosition()
  }
  return { x: 0, y: 0 }
}

type PropsType = {
  x: number
  y: number
  placement: PlacementType
  hovered: string
  onDragStart: (
    e: Konva.KonvaEventObject<DragEvent>,
    placement: PlacementType,
  ) => void
  onDragMove: (
    e: Konva.KonvaEventObject<DragEvent>,
    placement: PlacementType,
  ) => void
  onDragEnd: (
    e: Konva.KonvaEventObject<DragEvent>,
    placement: PlacementType,
  ) => void
}

export const Anchor = ({
  x,
  y,
  placement,
  hovered,
  onDragMove,
  onDragStart,
  onDragEnd,
}: PropsType) => {
  const anchorRef = useRef<Konva.Circle>(null)
  const hoveredAnchorRef = useRef<Konva.Circle>(null)

  useEffect(() => {
    if (hovered === placement) {
      hoveredAnchorRef.current?.to({
        radius: 10,
        duration: 0.2,
        easing: Konva.Easings.EaseIn,
      })
    } else {
      hoveredAnchorRef.current?.to({
        radius: 5,
        duration: 0.2,
        easing: Konva.Easings.EaseOut,
      })
    }
  }, [hovered, placement])

  return (
    <>
      <Circle
        ref={hoveredAnchorRef}
        id={placement}
        x={x}
        y={y}
        radius={12}
        fill="#2d9cdb"
        opacity={0.5}
        visible={hovered === placement}
        listening={false}
      />

      <Circle
        ref={anchorRef}
        id={placement}
        name="anchor"
        x={x}
        y={y}
        radius={6}
        fill="#2d9cdb"
        draggable
        onMouseEnter={(e) => {
          const container = e.target.getStage()?.container()
          if (!container) return

          container.style.cursor = 'crosshair'
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage()?.container()
          if (!container) return

          container.style.cursor = 'default'
        }}
        onDragStart={(e) => onDragStart(e, placement)}
        onDragMove={(e) => onDragMove(e, placement)}
        onDragEnd={(e) => onDragEnd(e, placement)}
        dragBoundFunc={() => dragBounds(anchorRef)}
        perfectDrawEnabled={false}
        listening={true}
      />
    </>
  )
}
