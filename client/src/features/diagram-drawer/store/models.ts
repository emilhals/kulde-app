import { proxy } from 'valtio'
import { proxyWithHistory } from 'valtio-history'
import { deepClone } from 'valtio/utils'

import {
    Box,
    ComponentType,
    ConnectionType,
    ItemType,
    PointType,
    TextType,
} from '@/features/diagram-drawer/types'

type Interaction =
    | 'idle'
    | 'pending-select'
    | 'selecting'
    | 'pending-drag'
    | 'dragging-item'
    | 'pending-connect'
    | 'connecting'

const initialDiagramState = {
    items: [] as ItemType[],
    connections: [] as ConnectionType[],
    texts: [] as TextType[],
}

export const initialUIState = {
    activeId: null as string | null,
    selectedIds: [] as string[],
    interaction: 'idle' as Interaction,
    dragged: null as ComponentType | null,
    action: null as string | null,
    pointerDown: false as boolean,
    pointerStart: { x: 0, y: 0 } as PointType,
    selectionBox: null as Box | null,
    dragOffset: { x: 0, y: 0 } as PointType,
    dragStartPositions: {} as Record<string, { x: number; y: number }>,
    shadowPosition: { x: 0, y: 0 } as PointType,
}

export const diagramHistory = proxyWithHistory(initialDiagramState)
export const uiState = proxy(deepClone(initialUIState))
