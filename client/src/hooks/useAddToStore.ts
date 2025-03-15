import { v4 as uuidv4 } from 'uuid'

import { ConnectionType, ItemType, TextType } from '@/common/types'
import { store } from '@/store'

export const useAddToStore = (data: ItemType | TextType | ConnectionType) => {
  const id = uuidv4()

  if ('height' in data) {
    try {
      store.items.push({
        ...data,
        id: id
      })
    } catch (error) {
      console.error(error)
    }
  }

  if ('color' in data) {
    try {
      store.texts.push({
        ...data,
        id: id
      })
    } catch (error) {
      console.error(error)
    }
  }

  if ('from' in data) {
    try {
      store.connections.push({
        ...data,
        id: id
      })

    } catch (error) {
      console.error(error)
    }
  }
}
