import { v4 as uuidv4 } from 'uuid'

import { ItemType } from '@/common/types'
import { store } from '@/store'

export const useAddToStore = (model: string, data: ItemType) => {
  const id = uuidv4()

  if (!data) {
    console.error('No data ', data)
  }

  switch (model) {
    case 'item':
      try {
        store.items.push({
          ...data,
          id: id
        })
      } catch (error) {
        console.error(error)
      }
      break
    default:
      console.log('Something went wrong with pushing to store!')
  }
}
