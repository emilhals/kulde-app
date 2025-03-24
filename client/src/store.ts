import { proxy } from 'valtio'

import { ItemType, ConnectionType, TextType } from '@/common/types'

export const store = proxy<{ items: ItemType[], connections: ConnectionType[], texts: TextType[], selected: string }>({
  items: [],
  connections: [],
  texts: [],
  selected: ''
})
