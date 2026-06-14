import {
    Box,
    Connection,
    Item,
    ItemPreview,
    Point,
    Text,
} from '@/features/diagram-drawer/types'
import { proxy } from 'valtio'
import { proxyWithHistory } from 'valtio-history'
import { deepClone } from 'valtio/utils'

type Interaction =
    | 'idle'
    | 'pending-select'
    | 'selecting'
    | 'pending-drag'
    | 'dragging-item'
    | 'pending-connect'
    | 'connecting'

type InteractedNode = {
    id: string
    type: 'item' | 'text' | 'connection'
}

const initialDiagramState = {
    items: [] as Item[],
    connections: [] as Connection[],
    texts: [] as Text[],
}

export const initialUIState = {
    activeNode: null as InteractedNode | null,
    selectedIds: [] as string[],
    hoveredNodeId: null as string | null,
    interaction: 'idle' as Interaction,
    dragged: null as ItemPreview | null,
    action: null as string | null,
    pointerDown: false as boolean,
    pointerStart: { x: 0, y: 0 } as Point,
    selectionBox: null as Box | null,
    dragOffset: { x: 0, y: 0 } as Point,
    dragStartPositions: {} as Record<string, { x: number; y: number }>,
}

export const diagramHistory = proxyWithHistory(initialDiagramState)
export const uiState = proxy(deepClone(initialUIState))
