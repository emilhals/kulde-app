import { v4 as uuidv4 } from 'uuid'

import { ItemType, ItemPreview, TextType, TextPreview, ConnectionPreview, ConnectionType } from '@/common/types'
import { store } from '@/store'

export const useAddToStore = (data: ItemPreview | TextPreview | ConnectionPreview) => {
  const id = uuidv4()

  switch (data.type) {
    case 'items':
      const newItem: ItemType = {
        ...data,
        id: id
      }

      store.items.push(newItem)
      return newItem

    case 'texts':
      const newText: TextType = {
        ...data,
        id: id
      }

      store.texts.push(newText)
      return newText

    case 'connections':
      const newConnection: ConnectionType = {
        ...data,
        id: id
      }

      store.connections.push(newConnection)
      return newConnection

    default:
      console.log('Error with pushing to store', data)
  }
}
