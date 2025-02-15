import { useEffect, useRef, useState } from 'react'

import Konva from 'konva'
import { Transformer, Rect, Text as KonvaText } from 'react-konva'

import { ItemType, PointType } from '@/common/types'
import { useCustomFont } from '@/hooks/useCustomFont'

export const Text = ({ parent }: { parent: ItemType }) => {
  const [fontLoaded] = useCustomFont('Open Sans:300,500')
  const textRef = useRef<Konva.Text>(null)
  const shadowRef = useRef<Konva.Rect>(null)
  const trRef = useRef<Konva.Transformer>(null)

  const textObject = textRef.current

  const [position, setPosition] = useState<PointType>({
    x: 0,
    y: 0
  })

  const [shadowPosition, setShadowPosition] = useState<PointType>({
    x: 0,
    y: 0
  })

  useEffect(() => {
    if (textRef.current)
      shadowRef.current?.hide()
  }, [textRef])

  /*
  * font loaded
  */
  useEffect(() => {
    /* center text */
    if (!textObject) return

    setPosition({
      x: (parent.width / 2) - (textObject.textWidth / 2),
      y: (parent.height / 2) - (textObject.textHeight / 2) + parent.height * 0.7
    })
  }, [fontLoaded])

  const handleDoubleClick = () => {
  }

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    shadowRef.current?.show()

    setShadowPosition({
      x: Math.round(e.target.x() / 16) * 16,
      y: Math.round(e.target.y() / 16) * 16
    })
  }


  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setPosition({
      x: Math.round(e.target.x() / 16) * 16 - parent.x,
      y: Math.round(e.target.y() / 16) * 16 - parent.y
    })

    shadowRef.current?.hide()
  }

  return (
    <>
      <Rect
        ref={shadowRef}
        fill="blue"
        opacity={0.4}
        x={shadowPosition.x}
        y={shadowPosition.y}
        height={textObject?.textHeight}
        width={textObject?.textWidth}
        name="shadow"
      />
      <KonvaText
        ref={textRef}
        draggable
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDblClick={handleDoubleClick}
        fontSize={16}
        fontStyle="600"
        fontFamily={fontLoaded ? 'Open Sans' : ''}
        text={parent.label}
        x={parent.x + position.x}
        y={parent.y + position.y}
        name="text"
      />
      <Transformer
        ref={trRef}
        enabledAnchors={['middle-left', 'middle-right']}
      />
    </>
  )
}
