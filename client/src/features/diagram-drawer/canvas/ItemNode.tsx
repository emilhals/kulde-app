import {
    SYMBOL_MAP,
    SymbolComponent,
} from '@/features/diagram-drawer/constants/SymbolMap'
import { uiState } from '@/features/diagram-drawer/store/models'
import type { Item } from '@/features/diagram-drawer/types'
import Konva from 'konva'
import { useRef } from 'react'
import { Group, Rect } from 'react-konva'

export const ItemNode = ({ item }: { item: Item }) => {
    const groupRef = useRef<Konva.Group>(null)

    const isDragging =
        uiState.interaction === 'dragging-item' &&
        uiState.activeNode?.id === item.id

    const Symbol: SymbolComponent = SYMBOL_MAP[item.component]

    return (
        <Group
            ref={groupRef}
            id={item.id}
            name="item"
            x={item.x}
            y={item.y}
            opacity={isDragging ? 0.3 : 1}
            onContextMenu={(e) => {
                e.evt.preventDefault()
            }}
            onMouseEnter={(e) => {
                const container = e.target.getStage()?.container()
                if (!container) return

                container.style.cursor = 'grab'
            }}
            onMouseLeave={(e) => {
                const container = e.target.getStage()?.container()
                if (!container) return

                container.style.cursor = 'default'
            }}
        >
            <Symbol item={item} />
            <Rect
                id={item.id}
                width={item.width}
                height={item.height}
                fill="transparent"
            />
        </Group>
    )
}
