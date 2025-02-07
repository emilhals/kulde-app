import { proxy } from "valtio"

type Item = {
  id: string,
  type: string,
  label: string,
  height: number,
  width: number,
  x: number,
  y: number,
  img: string
  lines: []
}

type Points = { x: 0, y: 0 }
type Line = {
  id: string,
  fromObject: Object,
  mid: Points,
  toObject: Object,
  complete: Boolean
  fromPointsOffset: Points,
  toPointsOffset: Points
}

export const store = proxy<{ items: Item[], lines: Line[] }>({
  items: [],
  lines: []
})
