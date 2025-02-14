import { useEffect, useRef } from 'react'

import Konva from 'konva'
import { Text as KonvaText } from 'react-konva'

import { ItemType } from '@/common/types'
import { useCustomFont } from '@/hooks/useCustomFont'

export const Text = ({ item }: { item: ItemType }) => {
  const [fontLoaded] = useCustomFont('Open Sans')
  const textRef = useRef<Konva.Text>(null)

  /*
  * text loaded
  */
  useEffect(() => {
    /* center text */
    const textObject = textRef.current
    if (!textObject) return

  }, [textRef])

  return (
    <KonvaText
      ref={textRef}
      draggable
      fontSize={16}
      fontStyle="400"
      fontFamily={fontLoaded ? 'Open Sans' : ''}
      text={item.label}
      x={item.x + item.textXOffset}
      y={item.y + item.textYOffset}
      name="text"
    />
  )
}
