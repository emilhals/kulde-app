import { proxy } from "valtio"

import { ItemType, Line } from "./common/types"

export const store = proxy<{ items: ItemType[], lines: Line[] }>({
  items: [],
  lines: []
})
