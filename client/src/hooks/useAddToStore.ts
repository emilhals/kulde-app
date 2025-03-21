import { v4 as uuidv4 } from 'uuid'

import { ConnectionPreview, ItemType, TextType } from '@/common/types'
import { store } from '@/store'

export const useAddToStore = (data: ItemType | TextType | ConnectionPreview) => {
  const id = uuidv4()

  switch (data.type) {
    case 'items':
      store.items.push({
        ...data,
        id: id
      })
      break

    case 'texts':
      store.texts.push({
        ...data,
        id: id
      })
      break

    case 'connections':
      store.connections.push({
        ...data,
        id: id
      })
      break
    default:
      console.log('Error with pushing to store', data)
  }
}
