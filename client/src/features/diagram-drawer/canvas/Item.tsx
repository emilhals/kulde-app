import Konva from 'konva'
import { useRef } from 'react'
import { Group, Line } from 'react-konva'

import { SYMBOL_MAP } from '@/features/diagram-drawer/canvas/symbols/SymbolMap'
import { uiState } from '@/features/diagram-drawer/store/models'
import { ItemType } from '@/features/diagram-drawer/types'
import { useSnapshot } from 'valtio'

export const Item = ({ item }: { item: ItemType }) => {
    const groupRef = useRef<Konva.Group>(null)

    const uiSnap = useSnapshot(uiState)
    const isDragging =
        uiSnap.interaction === 'dragging-item' && uiSnap.activeId === item.id

    const Symbol = SYMBOL_MAP[item.component]

    const borderPoints = [
        0,
        0,
        item.width,
        0,
        item.width,
        item.height,
        0,
        item.height,
        0,
        0,
    ]

    return (
        <>
            <Group
                ref={groupRef}
                name="item"
                data-type="item"
                id={item.id}
                x={item.x}
                y={item.y}
                opacity={isDragging ? 0.75 : 1}
                shadowBlur={isDragging ? 10 : 0}
                shadowOpacity={0.2}
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
                {isDragging && (
                    <Line
                        points={borderPoints}
                        stroke="#7C3AED"
                        dash={[6, 4]}
                        strokeWidth={2}
                        listening={false}
                        perfectDrawEnabled={false}
                    />
                )}

                <Symbol item={item} />
            </Group>
        </>
    )
}
