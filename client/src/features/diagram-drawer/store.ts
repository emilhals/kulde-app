import { proxy } from 'valtio'

import {
  ItemType,
  ConnectionType,
  TextType,
} from '@/features/diagram-drawer/types'

export const store = proxy<{
  items: ItemType[]
  connections: ConnectionType[]
  texts: TextType[]
  selected: ItemType | null
  dragged: string
}>({
  items: [],
  connections: [],
  texts: [],
  selected: null,
  dragged: '',
})
