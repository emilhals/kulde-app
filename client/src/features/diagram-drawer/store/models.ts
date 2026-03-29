import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'
import { proxyWithHistory } from 'valtio-history'

import {
    ItemType,
    ConnectionType,
    TextType,
    ComponentType,
    PointType,
} from '@/features/diagram-drawer/types'

const initialDiagramState = {
    items: [] as ItemType[],
    connections: [] as ConnectionType[],
    texts: [] as TextType[],
}

const initialUIState = {
    selected: null as ItemType | null,
    dragged: null as ComponentType | null,
    action: null as string | null,
    pointerDown: false as boolean,
    pointerStart: { x: 0, y: 0 } as PointType,
    dragging: false as boolean,
    dragOffset: { x: 0, y: 0 } as PointType,
    shadowPosition: { x: 0, y: 0 } as PointType,
}

export const diagramHistory = proxyWithHistory(initialDiagramState)
export const uiState = proxy(deepClone(initialUIState))
