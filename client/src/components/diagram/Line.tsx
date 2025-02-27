import { Line as KonvaLine } from 'react-konva'

import { v4 as uuidv4 } from 'uuid'

import { ItemType, PointType } from '@/common/types'
import { useEffect } from 'react'

export const Line = ({ from, mid, to }: { from: ItemType, mid: PointType, to: ItemType }) => {

  if (!from) return

  useEffect(() => {
    console.log("from from")
  }, [from])

  const id = uuidv4()

  if (from) {
    console.log("hello")


  }

  console.log("bye")
  /*
   * start line
   */
  const start = (from: ItemType) => {
    if (!from) return

    console.log("hello")

    console.log("from: ", from)
  }

  const middle = () => {

  }

  const end = () => {

  }

  return (
    <KonvaLine
      key={id}
      id={id}
      listening={false}
      stroke="black"
      strokeWidth={4}
      lineCap="round"
      points={[from.x, from.y, mid.x, mid.y, to.x, to.y]}
    />
  )
}
