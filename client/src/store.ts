import { proxy } from "valtio"

type Item = {
  id: string,
  type: string,
  label: string,
  x: number,
  y: number,
  img: string
}

export const store = proxy<{ items: Item[] }>({
  items: []
})
