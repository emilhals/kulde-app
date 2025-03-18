import { store } from '@/store'

export const useDeleteFromStore = (id: string) => {
  const index = store.items.findIndex((item) => item.id === id)

  if (index >= 0)
    store.items.splice(index, 1)
}
