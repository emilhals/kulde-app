import { Connector } from '@/features/diagram-drawer/canvas/Connector'
import { ItemNode } from '@/features/diagram-drawer/canvas/ItemNode'
import { Connection } from '@/features/diagram-drawer/canvas/Connection'
import { Selection } from '@/features/diagram-drawer/canvas/Selection'
import { TextNode } from '@/features/diagram-drawer/canvas/TextNode'
import { useConnectionPreview } from '@/features/diagram-drawer/hooks/useConnectionPreview'
import { useCustomFont } from '@/shared/hooks/useCustomFont'
import { useSnapToItem } from '@/features/diagram-drawer/hooks/useSnapToItem'
import { getAnyFromStore } from '@/features/diagram-drawer/store/actions'
import { diagramHistory } from '@/features/diagram-drawer/store/diagram-state'
import { uiState } from '@/features/diagram-drawer/store/ui-state'

import { canvasSettings } from '@/features/diagram-drawer/store/canvas-settings'

import type {
  ConnectionData,
  Point,
  Rect,
} from '@/features/diagram-drawer/types'
import { ComponentPanel } from '@/features/diagram-drawer/ui/ComponentPanel'
import ContextMenu from '@/features/diagram-drawer/ui/ContextMenu'
import { intersected } from '@/features/diagram-drawer/utils/konva'
import Konva from 'konva'
import { KonvaPointerEvent } from 'konva/lib/PointerEvents'
import { useRef, useState } from 'react'
import { Group, Layer, Stage, Transformer } from 'react-konva'
import { useSnapshot } from 'valtio'
import { UndoRedo } from './ui/UndoRedo'
import { useTheme } from '@/shared/contexts/theme-provider'
import { CanvasMenu } from './ui/CanvasMenu'
import { useResponsiveStage } from '@/shared/hooks/useResponsiveStage'
import { useCanvasDrop } from './hooks/useCanvasDrop'
import {
  CANVAS_COLORS,
  DRAG_THRESHOLD,
} from '@/features/diagram-drawer/constants/canvas'
import { useCanvasKeyboard } from './hooks/useCanvasKeyboard'
import { useGridLayer } from './hooks/useGridLayer'
import { useSnapToGrid } from './hooks/useSnapToGrid'
import { ExportButton } from './ui/ExportButton'

export const DiagramPage = () => {
  const { resolvedTheme } = useTheme()

  const diagramSnap = useSnapshot(diagramHistory)
  const uiSnap = useSnapshot(uiState)
  const canvasSettingsSnap = useSnapshot(canvasSettings)

  const stageRef = useRef<Konva.Stage>(null)
  const selectionRef = useRef<Konva.Transformer>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridLayer = useRef<Konva.Layer>(null)

  const [,] = useCustomFont('Inter')

  const [contextMenuPosition, setContextMenuPosition] = useState<Point | null>(
    null,
  )

  console.log(resolvedTheme)
  const colors = CANVAS_COLORS[resolvedTheme]

  const stage = useResponsiveStage(containerRef)
  const { handleDrop } = useCanvasDrop(stageRef, containerRef)
  const { isPanning, isSnapping, handleKeyUp, handleKeyDown } =
    useCanvasKeyboard(stageRef)
  const { applyItemSnap, resetItemSnap } = useSnapToItem(
    isSnapping,
    colors.guide,
  )
  const { previewGridSnap, applyGridSnap } = useSnapToGrid(isSnapping)

  const { connectionPreview, updatePreview, clearPreview } =
    useConnectionPreview()
  useGridLayer(
    stage,
    gridLayer,
    canvasSettingsSnap.showGrid,
    colors.grid,
    isPanning,
  )

  const handleContextMenu = (e: KonvaPointerEvent) => {
    e.evt.preventDefault()
    if (e.target === e.target.getStage()) return

    const stage = e.target.getStage()
    if (!stage) return

    const pointerPosition = stage.getPointerPosition()
    if (!pointerPosition) return

    const offset = 0
    setContextMenuPosition({
      x: pointerPosition.x + offset,
      y: pointerPosition.y + offset,
    })

    uiState.interaction = 'idle'

    e.cancelBubble = true
  }

  const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const stage = e.target.getStage()
    if (!stage) return

    if (e.target === stage) {
      setContextMenuPosition(null)
    }
    const pointer = stage.getRelativePointerPosition()
    if (!pointer) return

    const itemNode = e.target.findAncestor('.item')

    const node = getAnyFromStore(e.target.id())
    if (node && node.type === 'connections') {
      uiState.activeNode = { id: node.id, type: 'connection' }
    }

    if (itemNode) {
      if (!uiState.selectedIds.includes(itemNode.id())) {
        uiState.activeNode = { id: itemNode.id(), type: 'item' }
        uiState.selectedIds = [itemNode.id()]
      }

      const item = diagramHistory.value.items.find(
        (i) => i.id === itemNode.id(),
      )
      if (!item) return

      uiState.interaction = 'pending-drag'
      uiState.dragOffset = { x: pointer.x - item.x, y: pointer.y - item.y }
      uiState.selectedIds.forEach((id) => {
        const item = diagramHistory.value.items.find((i) => i.id === id)
        if (!item) return

        uiState.dragStartPositions[id] = { x: item.x, y: item.y }
      })
    } else {
      uiState.activeNode = null
      uiState.selectedIds = []
      uiState.interaction = 'pending-select'
    }

    uiState.pointerDown = true
    uiState.pointerStart = pointer
    uiState.selectionBox = { start: pointer, end: pointer }
  }

  const handlePointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (!uiState.pointerDown) return

    if (
      uiState.interaction === 'connecting' ||
      uiState.interaction === 'pending-connect'
    )
      return

    const pointer = stageRef.current?.getRelativePointerPosition()
    if (!pointer) return

    const dx = pointer.x - uiState.pointerStart.x
    const dy = pointer.y - uiState.pointerStart.y

    const distance = Math.sqrt(dx * dx + dy * dy)

    if (uiState.interaction === 'pending-drag' && distance > DRAG_THRESHOLD) {
      uiState.interaction = 'dragging-item'
    } else if (
      distance > DRAG_THRESHOLD &&
      uiState.interaction === 'pending-select'
    ) {
      uiState.interaction = 'selecting'
    }

    const activeNode = uiState.activeNode
    if (uiState.interaction === 'dragging-item') {
      if (activeNode && uiState.selectedIds.length <= 1) {
        const itemProxy = diagramHistory.value.items.find(
          (i) => i.id === activeNode.id,
        )
        if (itemProxy) {
          const stage = e.target.getStage()
          if (!stage) return

          const newPosition = {
            x: pointer.x - uiSnap.dragOffset.x,
            y: pointer.y - uiSnap.dragOffset.y,
          }

          previewGridSnap(newPosition)
          applyItemSnap(stage, itemProxy)

          itemProxy.x = newPosition.x
          itemProxy.y = newPosition.y
        }
      }

      if (uiState.selectedIds.length > 1) {
        uiState.activeNode = null
        diagramHistory.value.items.forEach((item) => {
          if (!(item.id in uiState.dragStartPositions)) return

          const start = uiState.dragStartPositions[item.id]

          item.x = start.x + dx
          item.y = start.y + dy
        })
      }
    }

    if (uiState.interaction === 'selecting') {
      const selectionBox = uiState.selectionBox
      if (!selectionBox) return

      selectionBox.end = pointer
      const selectionRect: Rect = {
        left: Math.min(selectionBox.start.x, selectionBox.end.x),
        right: Math.max(selectionBox.start.x, selectionBox.end.x),
        top: Math.min(selectionBox.start.y, selectionBox.end.y),
        bottom: Math.max(selectionBox.start.y, selectionBox.end.y),
      }

      const items = stageRef.current?.find('.item')
      if (!items) return

      const intersectedItems = diagramHistory.value.items
        .filter((item) =>
          intersected(selectionRect, {
            left: item.x,
            right: item.x + item.width,
            top: item.y,
            bottom: item.y + item.height,
          }),
        )
        .map((item) => item.id)

      if (intersectedItems.length === 1) {
        uiState.activeNode = { id: items[0].id(), type: 'item' }
      } else {
        uiState.selectedIds = intersectedItems
      }
    }
  }

  const handlePointerUp = () => {
    uiState.pointerDown = false
    uiState.dragStartPositions = {}
    uiState.selectionBox = null
    uiState.interaction = 'pending-select'

    resetItemSnap()

    if (canvasSettings.snapToGrid) {
      const activeNode = uiState.activeNode
      if (!activeNode) return

      const itemProxy = diagramHistory.value.items.find(
        (i) => i.id === activeNode.id,
      )
      if (!itemProxy) return

      console.log('Heeelo')
      applyGridSnap(itemProxy)
    }

    diagramHistory.saveHistory()
  }

  return (
    <div
      className="flex gap-2 py-2 px-2 w-full h-full min-h-0"
      onAuxClick={(e) => {
        if (e.button === 1) {
          e.preventDefault()
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault()
      }}
      onDragOver={(e) => {
        e.preventDefault()
      }}
      onDrop={handleDrop}
    >
      <div
        ref={containerRef}
        className={`relative flex-1 overflow-hidden rounded-lg border border-gray-300 bg-zinc-100 bg-[length:16px_16px] focus:outline-none dark:border-slate-600 dark:bg-slate-800 ${!canvasSettingsSnap.showGrid && 'bg-[radial-gradient(#D9D9D9_1px,transparent_1px)] dark:bg-[radial-gradient(#3a3a3a_1px,transparent_1px)]'}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <div className="absolute top-6 left-6 z-50">
          <UndoRedo />
        </div>

        <div className="flex absolute top-6 right-6 z-50 gap-3 items-center">
          <ExportButton />
          <CanvasMenu />
        </div>

        {stage && (
          <Stage
            ref={stageRef}
            width={stage.width}
            height={stage.height}
            scaleX={stage.scale}
            scaleY={stage.scale}
            onContextMenu={handleContextMenu}
            draggable={isPanning}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <Layer ref={gridLayer}></Layer>
            <Layer>
              <Group>
                {diagramSnap.value.texts.map((text) => {
                  return <TextNode key={text.id} text={text} />
                })}
              </Group>

              <Group>
                {diagramSnap.value.connections.map(
                  (connection: ConnectionData) => {
                    return (
                      <Connection
                        key={connection.id}
                        connection={connection}
                        foregroundColor={colors.foreground}
                        backgroundColor={colors.background}
                        lineColor={colors.connection}
                      />
                    )
                  },
                )}
              </Group>
              <Group>
                {diagramSnap.value.items.map((item) => {
                  return <ItemNode key={item.id} item={item} />
                })}
              </Group>
            </Layer>

            <Layer>
              <Connector
                stageRef={stageRef}
                updatePreview={updatePreview}
                clearPreview={clearPreview}
              />
            </Layer>

            <Layer id="preview-layer" listening={false}>
              {connectionPreview}
            </Layer>

            <Layer>
              <Selection selection={uiSnap.selectionBox} />
              <Transformer ref={selectionRef} />
            </Layer>
          </Stage>
        )}
      </div>

      <ComponentPanel show={canvasSettingsSnap.componentPanelOpen} />

      {contextMenuPosition && (
        <ContextMenu
          position={contextMenuPosition}
          onClose={() => setContextMenuPosition(null)}
        />
      )}
    </div>
  )
}
