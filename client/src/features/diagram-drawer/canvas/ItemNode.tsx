import {
  SYMBOL_MAP,
  SymbolComponent,
} from '@/features/diagram-drawer/constants/SymbolMap'
import { uiState } from '@/features/diagram-drawer/store/ui-state'

import { canvasSettings } from '@/features/diagram-drawer/store/canvas-settings'
import type { Item } from '@/features/diagram-drawer/types'
import Konva from 'konva'
import { useRef } from 'react'
import { Group, Rect } from 'react-konva'
import { useSnapshot } from 'valtio'
import { CANVAS_COLORS } from '../constants/canvas'
import { useCanvasTheme } from '../hooks/useCanvasTheme'

export const ItemNode = ({ item }: { item: Item }) => {
  const canvasSettingsSnap = useSnapshot(canvasSettings)
  const uiSnap = useSnapshot(uiState)

  const canvasTheme = useCanvasTheme()

  const groupRef = useRef<Konva.Group>(null)

  console.log(canvasTheme)
  const colors = CANVAS_COLORS[canvasTheme]

  const isDragging =
    uiState.interaction === 'dragging-item' &&
    uiState.activeNode?.id === item.id

  const Symbol: SymbolComponent = SYMBOL_MAP[item.component]

  const showShadow =
    isDragging && canvasSettingsSnap.snapToGrid && uiSnap.gridSnapPreview

  return (
    <Group>
      <Group
        ref={groupRef}
        id={item.id}
        name="item"
        x={item.x}
        y={item.y}
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
        <Symbol
          item={item}
          strokeColor={colors.foreground}
          fillColor={colors.background}
        />

        {/* Hitbox for non-rectangle symbols */}
        <Rect
          id={item.id}
          width={item.width}
          height={item.height}
          fill="transparent"
        />
      </Group>

      {showShadow && (
        <Rect
          id={`${item.id}-shadow`}
          width={item.width}
          height={item.height}
          x={uiSnap.gridSnapPreview.x}
          y={uiSnap.gridSnapPreview.y}
          opacity={0.4}
          stroke="#404040"
          strokeWidth={2}
          dash={[20, 2]}
          fill="#202020"
        />
      )}
    </Group>
  )
}
