import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'
import {
  ItemType,
  ConnectionType,
  TextType,
  ItemPreview,
  TextPreview,
  ConnectionPreview,
} from '@/features/diagram-drawer/types'

import { v4 as uuidv4 } from 'uuid'

const initialState = {
  items: [] as ItemType[],
  connections: [] as ConnectionType[],
  texts: [] as TextType[],
  selected: null as ItemType | null,
  dragged: '',
  action: '',
}

export const store = proxy(deepClone(initialState))

export const addToStore = (
  property: ItemPreview | TextPreview | ConnectionPreview,
) => {
  if (!property || !property.type) return null

  const id = uuidv4()

  if (property.type === 'items') {
    const newItem = { ...property, id: id }
    store.items.push(newItem)
    return newItem
  }

  if (property.type === 'texts') {
    const newText = store.texts.push({ ...property, id: id })
    return newText
  }

  if (property.type === 'connections') {
    const newConnection = store.connections.push({ ...property, id: id })
    return newConnection
  }
}

export const getFromStore = (id: string) => {
  return (
    store.items.find((object) => object.id === id) ??
    store.texts.find((object) => object.id === id) ??
    store.connections.find((object) => object.id === id)
  )
}

export const removeFromStore = (
  property: ItemType | TextType | ConnectionType,
) => {
  const index = store[property.type].findIndex(
    (object) => object.id === property.id,
  )

  if (index >= 0) {
    store[property.type].splice(index, 1)
  }
}

export const clearStore = () => {
  Object.assign(store, deepClone(initialState))
}
