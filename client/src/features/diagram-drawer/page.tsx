import { Connection } from '@/features/diagram-drawer/canvas/Connection'
import { Connector } from '@/features/diagram-drawer/canvas/Connector'
import { ItemNode } from '@/features/diagram-drawer/canvas/ItemNode'
import { Selection } from '@/features/diagram-drawer/canvas/Selection'
import { TextNode } from '@/features/diagram-drawer/canvas/TextNode'
import { useConnectionPreview } from '@/features/diagram-drawer/hooks/useConnectionPreview'
import { diagramHistory } from '@/features/diagram-drawer/store/diagram-state'
import { uiState } from '@/features/diagram-drawer/store/ui-state'
import { useCustomFont } from '@/features/shared/hooks/useCustomFont'

import { canvasSettings } from '@/features/diagram-drawer/store/canvas-settings'

import { CANVAS_COLORS } from '@/features/diagram-drawer/constants/canvas'
import type {
  ConnectionData,
  ExportBackground,
  Point,
} from '@/features/diagram-drawer/types'
import { ComponentPanel } from '@/features/diagram-drawer/ui/ComponentPanel'
import ContextMenu from '@/features/diagram-drawer/ui/ContextMenu'
import { useTheme } from '@/features/shared/contexts/theme-provider'
import { useResponsiveStage } from '@/features/shared/hooks/useResponsiveStage'
import Konva from 'konva'
import { KonvaPointerEvent } from 'konva/lib/PointerEvents'
import { useEffect, useRef, useState } from 'react'
import {
  Group,
  Rect as KonvaRect,
  Layer,
  Stage,
  Transformer,
} from 'react-konva'
import { useSnapshot } from 'valtio'
import { ResolvedTheme } from '../shared/types'
import { useCanvasDrop } from './hooks/useCanvasDrop'
import { useCanvasKeyboard } from './hooks/useCanvasKeyboard'
import { useCanvasPointer } from './hooks/useCanvasPointer'
import { useGridLayer } from './hooks/useGridLayer'
import { useSnapToGrid } from './hooks/useSnapToGrid'
import { useSnapToItem } from './hooks/useSnapToItem'
import { CanvasMenu } from './ui/CanvasMenu'
import { ExportDialog } from './ui/ExportDialog'
import { ShortcutsDialog } from './ui/ShortcutsDialog'
import { UndoRedo } from './ui/UndoRedo'

export const DiagramPage = () => {
  const { resolvedTheme } = useTheme()

  const diagramSnap = useSnapshot(diagramHistory)
  const uiSnap = useSnapshot(uiState)
  const canvasSettingsSnap = useSnapshot(canvasSettings)

  const stageRef = useRef<Konva.Stage>(null)
  const selectionRef = useRef<Konva.Transformer>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridLayer = useRef<Konva.Layer>(null)
  const backgroundRef = useRef<Konva.Rect>(null)
  const connectorLayerRef = useRef<Konva.Layer>(null)

  const [canvasPreviewURL, setCanvasPreviewUrl] = useState('')
  const [contextMenuPosition, setContextMenuPosition] = useState<Point | null>(
    null,
  )
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [exportBackground, setExportBackground] =
    useState<ExportBackground>('transparent')

  const colors = CANVAS_COLORS[resolvedTheme]

  const [,] = useCustomFont('Inter')

  const stage = useResponsiveStage(containerRef)
  const { handleDrop } = useCanvasDrop(stageRef, containerRef)
  const { isPanning, isSnapping, handleKeyUp, handleKeyDown } =
    useCanvasKeyboard()
  const { applyItemSnap, resetItemSnap } = useSnapToItem(
    isSnapping,
    colors.guide,
  )
  const { previewGridSnap, applyGridSnap } = useSnapToGrid(isSnapping)
  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    useCanvasPointer({
      previewGridSnap,
      applyGridSnap,
      applyItemSnap,
      resetItemSnap,
    })

  const { connectionPreview, updatePreview, clearPreview } =
    useConnectionPreview()

  useGridLayer(
    stage,
    gridLayer,
    canvasSettingsSnap.showGrid,
    colors.grid,
    isPanning,
  )

  useEffect(() => {
    canvasSettings.isExportRendering = true

    let secondFrame = 0
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        stageRef.current?.batchDraw()
        updateCanvasPreview()
        canvasSettings.isExportRendering = false
      })
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
      canvasSettings.isExportRendering = false
    }
  }, [exportBackground])

  const updateCanvasPreview = () => {
    const stage = stageRef.current
    const backgroundRect = backgroundRef.current
    if (!stage || !backgroundRect) return

    const activeNode = uiState.activeNode

    try {
      gridLayer.current?.hide()
      connectorLayerRef.current?.hide()
      uiState.activeNode = null

      if (exportBackground !== 'transparent') {
        const backgroundColor =
          CANVAS_COLORS[exportBackground as ResolvedTheme].background

        backgroundRect.fill(backgroundColor)
      } else {
        backgroundRect.fill('')
      }

      const url = stage.toDataURL({ pixelRatio: 2 })
      setCanvasPreviewUrl(url)
    } finally {
      canvasSettings.isExportRendering = false
      uiState.activeNode = activeNode
      backgroundRect.fill('')
      gridLayer.current?.show()
      connectorLayerRef.current?.show()
    }
  }

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

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()

    const scaleBy = 1.05

    const stage = stageRef.current
    if (!stage) return

    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    if (!pointer) return

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    let direction = e.evt.deltaY > 0 ? -1 : 1
    if (e.evt.ctrlKey) {
      direction = -direction
    }

    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy
    newScale = Math.max(0.1, Math.min(10, newScale))

    canvasSettings.stageView.scale = newScale
    canvasSettings.stageView.x = pointer.x - mousePointTo.x * newScale
    canvasSettings.stageView.y = pointer.y - mousePointTo.y * newScale
  }

  return (
    <div
      className="flex h-full min-h-0 w-full gap-2 px-2 py-2"
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
        <div className="absolute left-6 top-6 z-50">
          <UndoRedo />
        </div>

        <div className="absolute right-6 top-6 z-50 flex items-center gap-3">
          <ExportDialog
            canvasPreviewURL={canvasPreviewURL}
            background={exportBackground}
            onBackgroundChange={setExportBackground}
          />
          <CanvasMenu onOpenShortcuts={() => setIsShortcutsOpen(true)} />
        </div>

        <ShortcutsDialog
          isOpen={isShortcutsOpen}
          onOpenChange={setIsShortcutsOpen}
        />

        {stage && (
          <Stage
            ref={stageRef}
            width={stage.width}
            height={stage.height}
            x={canvasSettingsSnap.stageView.x}
            y={canvasSettingsSnap.stageView.y}
            scaleX={canvasSettingsSnap.stageView.scale}
            scaleY={canvasSettingsSnap.stageView.scale}
            onContextMenu={handleContextMenu}
            onWheel={handleWheel}
            draggable={isPanning}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <Layer>
              <KonvaRect
                ref={backgroundRef}
                width={stage.width}
                height={stage.height}
                x={canvasSettingsSnap.stageView.x}
                y={canvasSettingsSnap.stageView.y}
                listening={false}
              />
            </Layer>
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

            <Layer ref={connectorLayerRef}>
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
