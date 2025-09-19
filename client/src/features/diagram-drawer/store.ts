import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'
import {
  ItemType,
  ConnectionType,
  TextType,
} from '@/features/diagram-drawer/types'

const initialState = {
  items: [] as ItemType[],
  connections: [] as ConnectionType[],
  texts: [] as TextType[],
  selected: null as ItemType | null,
  dragged: '',
}

export const store = proxy(deepClone(initialState))

export const clearStore = () => {
  Object.assign(store, deepClone(initialState))
}
