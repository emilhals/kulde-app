import { useRef } from 'react'
import { Group } from 'react-konva'
import Konva from 'konva'

import { SYMBOL_MAP } from '@/features/diagram-drawer/canvas/symbols/SymbolMap'
import { uiState, diagramHistory } from '@/features/diagram-drawer/store'
import { ItemType } from '@/features/diagram-drawer/types'
import { useSnapshot } from 'valtio'

export const Item = ({ item }: { item: ItemType }) => {
    const groupRef = useRef<Konva.Group>(null)

    const uiSnap = useSnapshot(uiState)
    const isDragging = uiSnap.dragging && uiSnap.selected?.id === item.id

    const Symbol = SYMBOL_MAP[item.component]

    const proxyItem = diagramHistory.value.items.find((i) => i.id === item.id)
    if (!proxyItem) return null

    const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
        const stage = e.target.getStage()
        const pointer = stage?.getPointerPosition()
        if (!pointer) return

        uiState.selected = proxyItem

        uiState.pointerDown = true
        uiState.pointerStart = pointer

        uiState.dragOffset = {
            x: pointer.x - item.x,
            y: pointer.y - item.y,
        }

        uiState.shadowPosition = {
            x: item.x,
            y: item.y,
        }
    }

    return (
        <>
            {!isDragging && (
                <Group
                    ref={groupRef}
                    id={item.id}
                    x={item.x}
                    y={item.y}
                    onPointerDown={handlePointerDown}
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
                </Group>
            )}

            {isDragging && (
                <Group
                    x={uiSnap.shadowPosition.x}
                    y={uiSnap.shadowPosition.y}
                    opacity={0.6}
                >
                    <Symbol item={item} />
                </Group>
            )}
        </>
    )
}
