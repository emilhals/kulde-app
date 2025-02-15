import { store } from '@/store'

/*
 *
 * TODO: allow for line deletion. try/catch ? 
 * 
 */
export const useDeleteFromStore = (id: string) => {
  const index = store.items.findIndex((item) => item.id === id)

  if (index >= 0)
    store.items.splice(index, 1)
}
