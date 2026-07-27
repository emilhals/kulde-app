import Konva from 'konva'
import { useSnapshot } from 'valtio'
import { DRAG_THRESHOLD } from '../constants/canvas'
import { getProxyObjectFromNode } from '../helpers/getProxyObjectFromNode'
import { canvasSettings } from '../store/canvas-settings'
import { diagramHistory } from '../store/diagram-state'
import { uiState } from '../store/ui-state'
import { Item, Point, Rect } from '../types'
import { intersected } from '../utils/konva'

type CanvasPointerProps = {
  previewGridSnap: (position: Point) => void
  applyGridSnap: (itemProxy: Item) => void
  applyItemSnap: (stage: Konva.Stage, itemProxy: Item) => void
  resetItemSnap: () => void
}

export const useCanvasPointer = ({
  previewGridSnap,
  applyGridSnap,
  applyItemSnap,
  resetItemSnap,
}: CanvasPointerProps) => {
  const uiSnap = useSnapshot(uiState)

  const handlePointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const stage = e.target.getStage()
    if (!stage) return

    const pointer = stage.getRelativePointerPosition()
    if (!pointer) return

    const itemNode = e.target.findAncestor('.item')
    const itemProxy = getProxyObjectFromNode(itemNode)

    if (itemProxy && itemProxy.type === 'items') {
      if (!uiState.selectedIds.includes(itemProxy.id)) {
        uiState.activeNode = { id: itemProxy.id, type: 'item' }
        uiState.selectedIds = [itemProxy.id]
      }

      uiState.interaction = 'pending-drag'
      uiState.dragOffset = {
        x: pointer.x - itemProxy.x,
        y: pointer.y - itemProxy.y,
      }

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

    const stage = e.target.getStage()
    if (!stage) return
    const pointer = stage.getRelativePointerPosition()
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

      const items = stage.find('.item')
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

      uiState.selectedIds = intersectedItems
    }
  }

  const handlePointerUp = () => {
    uiState.pointerDown = false
    uiState.dragStartPositions = {}
    uiState.selectionBox = null
    uiState.interaction = 'pending-select'

    if (canvasSettings.snapToGrid) {
      const activeNode = uiState.activeNode
      if (!activeNode) return

      const itemProxy = diagramHistory.value.items.find(
        (i) => i.id === activeNode.id,
      )
      if (!itemProxy) return

      applyGridSnap(itemProxy)
    }

    diagramHistory.saveHistory()
  }

  return { handlePointerDown, handlePointerMove, handlePointerUp }
}
