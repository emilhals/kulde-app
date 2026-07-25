import { addToStore } from '@/features/diagram-drawer/store/actions'
import { uiState } from '@/features/diagram-drawer/store/ui-state'
import { Item, WithoutId } from '@/features/diagram-drawer/types'
import Konva from 'konva'
import { RefObject } from 'react'
import { canvasSettings } from '@/features/diagram-drawer/store/canvas-settings'
import { snapPointToGrid } from '@/features/diagram-drawer/utils/grid'

export const useCanvasDrop = (
  stageRef: RefObject<Konva.Stage>,
  containerRef: RefObject<HTMLDivElement>,
) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const stage = stageRef.current
    if (!stage) return

    stage.setPointersPositions(e)

    const position = stage.getRelativePointerPosition()
    const dragged = uiState.dragged

    if (!position || !dragged) return

    const rawX = position.x - dragged.width / 2
    const rawY = position.y - dragged.height / 2

    const { x, y } = canvasSettings.snapToGrid
      ? snapPointToGrid({ x: rawX, y: rawY })
      : { x: rawX, y: rawY }

    const newItem: WithoutId<Item> = {
      type: 'items',
      component: dragged.component,
      height: dragged.height,
      width: dragged.width,
      x: x,
      y: y,
      locked: false,
      anchors: dragged.anchors,
    }

    const addedItem = addToStore(newItem)
    if (!addedItem) return

    addToStore({
      type: 'texts',
      content: '',
      position: { x: newItem.x + newItem.width / 2, y: newItem.y - 20 },
      color: '#000000',
      size: 14,
      attributes: [],
      anchor: { type: 'item', itemId: addedItem.id, offset: { x: 0, y: -20 } },
    })

    uiState.dragged = null

    containerRef.current?.focus()
  }

  return { handleDrop }
}
