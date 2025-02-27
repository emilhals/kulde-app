import { v4 as uuidv4 } from 'uuid'

import { ItemType, TextType } from '@/common/types'
import { store } from '@/store'

export const useAddToStore = (model: string, data: ItemType | TextType) => {
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
    case 'text':
      try {
        store.texts.push({
          ...data,
          id: id
        })
        console.log('hei')
      } catch (error) {
        console.error(error)
      }
      break
    default:
      console.log('Something went wrong with pushing to store!')
  }
}
