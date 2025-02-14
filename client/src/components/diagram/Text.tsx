import { useEffect, useRef, useState } from 'react'

import Konva from 'konva'
import { Text as KonvaText } from 'react-konva'

import { ItemType, PointType } from '@/common/types'
import { useCustomFont } from '@/hooks/useCustomFont'

export const Text = ({ item }: { item: ItemType }) => {
  const [fontLoaded] = useCustomFont('Open Sans')
  const textRef = useRef<Konva.Text>(null)

  const [position, setPosition] = useState<PointType>({
    x: 0,
    y: 0
  })

  /*
  * text loaded
  */
  useEffect(() => {
    /* center text */
    if (fontLoaded) {
      const textObject = textRef.current
      if (!textObject) return

      setPosition({
        x: (item.width / 2) - (textObject.textWidth / 2),
        y: 100
      })
    }
  }, [fontLoaded])

  return (
    <KonvaText
      ref={textRef}
      draggable
      fontSize={16}
      fontStyle="400"
      fontFamily={fontLoaded ? 'Open Sans' : ''}
      text={item.label}
      x={item.x + position.x}
      y={item.y + position.y}
      name="text"
    />
  )
}
