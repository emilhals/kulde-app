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

type Line = {
  id: string,
  from: Object,
  mid: Object,
  to: Object,
  complete: Boolean
}

export const store = proxy<{ items: Item[], lines: Line[] }>({
  items: [],
  lines: []
})
