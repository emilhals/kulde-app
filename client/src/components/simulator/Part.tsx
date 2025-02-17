import React from 'react'

import { Rect, Text } from 'react-konva'
import { useCustomFont } from '@/hooks/useCustomFont'


const Part: React.FC<{ type: string, x: number, y: number }> = (props) => {
  const fontLoaded = useCustomFont('Open Sans')

  return (
    <>
      <Text fontFamily={fontLoaded ? "Open Sans" : "Arial"} fontSize={30} x={props.x - 350} y={props.y - 85} text={props.type} align="center" wrap="char" width={700} />
      <Rect x={props.x - 50} y={props.y - 50} width={100} height={100} fill="black" />
    </>
  )
}
export default Part
