import { proxy } from "valtio"

type Item = {
  id: string,
  type: string,
  x: number,
  y: number,
}

export const store = proxy<{ items: Item[] }>({
  items: []
})
