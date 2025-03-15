import { useRef } from 'react'
import Konva from 'konva'
import { Circle } from 'react-konva'

const dragBounds = (ref: React.RefObject<Konva.Circle>) => {
  if (ref.current !== null) {
    return ref.current.getAbsolutePosition()
  }
  return { x: 0, y: 0 }
}

export const Anchor = ({ x, y, id, onDragMove, onDragStart, onDragEnd, handleClick }) => {
  const anchor = useRef<Konva.Circle>(null)

  return (
    <>
      <Circle
        id={id}
        x={x}
        y={y}
        radius={5}
        fill='black'
        draggable
        onClick={handleClick}
        onDragStart={(e) => onDragStart(e, id)}
        onDragMove={(e) => onDragMove(e, id)}
        onDragEnd={(e) => onDragEnd(e, id)}
        dragBoundFunc={() => dragBounds(anchor)}
        perfectDrawEnabled={false}
        ref={anchor}
      />
    </>
  )
}
