import { useRef, useState } from 'react'
import { Group, Rect } from 'react-konva'
import Konva from 'konva'

import { SYMBOL_MAP } from '@/features/diagram-drawer/canvas/symbols/SymbolMap'
import { uiState, diagramHistory } from '@/features/diagram-drawer/store'
import { ItemType, PointType } from '@/features/diagram-drawer/types'

export const Item = ({ item }: { item: ItemType }) => {
  const groupRef = useRef<Konva.Group>(null)
  const shadowRef = useRef<Konva.Rect>(null)

  const [shadowPosition, setShadowPosition] = useState<PointType>({
    x: -10000,
    y: -10000,
  })

  const Symbol = SYMBOL_MAP[item.component]

  const proxyItem = diagramHistory.value.items.find((i) => i.id === item.id)
  if (!proxyItem) return null

  const handleOnPointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    uiState.selected = proxyItem

    shadowRef.current?.hide()
    setShadowPosition({
      x: Math.round(e.target.getAbsolutePosition().x / 16) * 16,
      y: Math.round(e.target.getAbsolutePosition().y / 16) * 16,
    })
  }

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    shadowRef.current?.show()

    setShadowPosition({
      x: Math.round(e.target.getAbsolutePosition().x / 16) * 16,
      y: Math.round(e.target.getAbsolutePosition().y / 16) * 16,
    })

    proxyItem.x = e.target.getAbsolutePosition().x
    proxyItem.y = e.target.getAbsolutePosition().y

    diagramHistory.value.connections.forEach((conn) => {
      if (conn.from && conn.from.id === item.id) {
        conn.from = proxyItem
      }
      if (conn.to && conn.to.id === item.id) {
        conn.to = proxyItem
      }
    })
  }

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    shadowRef.current?.hide()

    /* snap to dot-grid */
    proxyItem.x = Math.round(e.target.getAbsolutePosition().x / 16) * 16
    proxyItem.y = Math.round(e.target.getAbsolutePosition().y / 16) * 16

    setShadowPosition({
      x: Math.round(e.target.getAbsolutePosition().x / 16) * 16,
      y: Math.round(e.target.getAbsolutePosition().y / 16) * 16,
    })

    diagramHistory.value.connections.forEach((conn) => {
      if (conn.from && conn.from.id === proxyItem.id) {
        conn.from = proxyItem
      }
      if (conn.to && conn?.to.id === proxyItem.id) {
        conn.to = proxyItem
      }
    })
  }

  return (
    <Group>
      <Group
        ref={groupRef}
        id={item.id}
        name="object"
        draggable={!item.locked}
        x={item.x}
        y={item.y}
        onPointerDown={handleOnPointerDown}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
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
        <Rect
          ref={shadowRef}
          name="shadow"
          x={shadowPosition.x - item.x}
          y={shadowPosition.y - item.y}
          height={item.height}
          width={item.width}
          strokeWidth={2}
          stroke="black"
          opacity={0.2}
          onPointerDown={handleOnPointerDown}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />

        <Symbol item={item} />
      </Group>
    </Group>
  )
}
