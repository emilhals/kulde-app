import { proxy } from "valtio"

import { ItemType, LineType, TextType } from "./common/types"

export const store = proxy<{ items: ItemType[], lines: LineType[], texts: TextType[] }>({
  items: [],
  lines: [],
  texts: []
})
