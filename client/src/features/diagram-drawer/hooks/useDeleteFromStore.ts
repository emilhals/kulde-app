import { store } from '@/store'

export const useDeleteFromStore = (id: string) => {
  const index = store.items.findIndex((item) => item.id === id)
  const connection = store.connections.findIndex(
    (conn) => conn.from.id === id || conn.to.id === id,
  )

  if (connection >= 0) store.connections.splice(connection, 10)

  if (index >= 0) {
    store.items.splice(index, 1)
    store.selected = null
  }
}
