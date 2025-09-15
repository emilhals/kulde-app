import { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import {
  ConnectionPreview,
  ConnectionType,
  ItemType,
  PlacementType,
} from '@/features/diagram-drawer/types'

import { getOffset } from '@/features/diagram-drawer/utils/helpers'

import { store } from '@/features/diagram-drawer/store'

export const useCreateConnection = () => {
  const [connection, setConnection] = useState<ConnectionPreview>()

  const setInitialConnection = (from: ItemType) => {
    setConnection({
      from: from,
      to: null,
      points: [],
      offsets: {
        from: {
          placement: null,
          position: { x: 0, y: 0 },
        },
        to: {
          placement: null,
          position: { x: 0, y: 0 },
        },
      },
      type: 'connections',
    })
  }

  const addConnectionToStore = (
    toItem: ItemType,
    initialAnchorPlacement: PlacementType,
    activeAnchorPlacement: PlacementType,
  ) => {
    if (!connection || !connection.from) return null

    const updatedConnection: ConnectionType = {
      ...connection,
      id: uuidv4(),
      to: toItem,
      offsets: {
        from: {
          placement: initialAnchorPlacement,
          position: getOffset(initialAnchorPlacement, connection.from),
        },
        to: {
          placement: activeAnchorPlacement,
          position: getOffset(activeAnchorPlacement, toItem),
        },
      },
    }

    store.connections.push(updatedConnection)
    clearConnection()
  }

  const clearConnection = () => {
    setConnection({
      from: null,
      to: null,
      points: [],
      offsets: {
        from: {
          placement: null,
          position: { x: 0, y: 0 },
        },
        to: {
          placement: null,
          position: { x: 0, y: 0 },
        },
      },
      type: 'connections',
    })
  }

  return {
    connection,
    setInitialConnection,
    addConnectionToStore,
    clearConnection,
  }
}
