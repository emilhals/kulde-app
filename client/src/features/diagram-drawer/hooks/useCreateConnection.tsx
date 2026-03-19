import { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import {
    ConnectionPreview,
    ConnectionType,
    PlacementType,
} from '@/features/diagram-drawer/types'

import { getOffset } from '@/features/diagram-drawer/utils/helpers'

import { diagramHistory } from '@/features/diagram-drawer/store'

export const useCreateConnection = () => {
    const [connection, setConnection] = useState<ConnectionPreview | null>(null)

    const setInitialConnection = (fromId: string) => {
        setConnection({
            fromId: fromId,
            toId: '',
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
        toItemId: string,
        initialAnchorPlacement: PlacementType,
        activeAnchorPlacement: PlacementType,
    ) => {
        if (!connection || !connection.fromId) return null

        const fromItem = diagramHistory.value.items.find(
            (i) => i.id === connection.fromId,
        )

        const toItem = diagramHistory.value.items.find((i) => i.id === toItemId)

        if (!fromItem || !toItem) return null

        const updatedConnection: ConnectionType = {
            ...connection,
            id: uuidv4(),
            fromId: connection.fromId,
            toId: toItem.id,
            offsets: {
                from: {
                    placement: initialAnchorPlacement,
                    position: getOffset(initialAnchorPlacement, fromItem),
                },
                to: {
                    placement: activeAnchorPlacement,
                    position: getOffset(activeAnchorPlacement, toItem),
                },
            },
            points: [],
        }

        diagramHistory.value.connections.push(updatedConnection)
        clearConnection()
    }

    const clearConnection = () => {
        setConnection(null)
    }

    return {
        connection,
        setInitialConnection,
        addConnectionToStore,
        clearConnection,
    }
}
