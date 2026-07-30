import { uiState } from '@/features/diagram-drawer/store/ui-state'
import type { Item, Point } from '@/features/diagram-drawer/types'
import { snapToGrid } from '@/features/diagram-drawer/utils/grid'

export const useSnapToGrid = (isSnapping: boolean) => {
  const previewGridSnap = (position: Point) => {
    if (isSnapping) {
      uiState.gridSnapPreview = null
      return
    }

    const snapped = { x: snapToGrid(position.x), y: snapToGrid(position.y) }
    uiState.gridSnapPreview = snapped
    return snapped
  }

  const applyGridSnap = (itemProxy: Item) => {
    if (isSnapping || !uiState.gridSnapPreview) return

    itemProxy.x = uiState.gridSnapPreview.x
    itemProxy.y = uiState.gridSnapPreview.y

    uiState.gridSnapPreview = null
  }

  return { previewGridSnap, applyGridSnap }
}
