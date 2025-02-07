import { proxy } from "valtio"

type Item = {
  id: string,
  type: string,
  label: string,
  height: number,
  width: number,
  x: number,
  y: number,
  textX: number,
  textY: number,
  img: string
  lines: []
}

type Text = {
  id: string,
  text: string,
  width: number,
  height: number,
  x: number,
  y: number,
  parent: Item
}

type Points = { x: number, y: number }
type Line = {
  id: string,
  fromObject: Item,
  mid: Points,
  toObject: Item,
  complete: Boolean
  fromPointsOffset: Points,
  toPointsOffset: Points
}

export const store = proxy<{ items: Item[], lines: Line[] }>({
  items: [],
  lines: []
})
