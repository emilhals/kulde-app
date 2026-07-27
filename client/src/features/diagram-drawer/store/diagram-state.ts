import { ConnectionData, Item, Text } from '@/features/diagram-drawer/types'
import { proxyWithHistory } from 'valtio-history'

const initialDiagramState = {
  items: [] as Item[],
  connections: [] as ConnectionData[],
  texts: [] as Text[],
}

export const diagramHistory = proxyWithHistory(initialDiagramState, {
  skipSubscribe: true,
})
