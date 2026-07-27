import { removeFromStore } from '@/features/diagram-drawer/store/actions'
import {
  toggleComponentPanel,
  toggleGrid,
  toggleSnapToGrid,
} from '@/features/diagram-drawer/store/canvas-settings.actions'
import { diagramHistory } from '@/features/diagram-drawer/store/diagram-state'
import { uiState } from '@/features/diagram-drawer/store/ui-state'
import { useState } from 'react'

export const useCanvasKeyboard = () => {
  const [isPanning, setIsPanning] = useState(false)
  const [isSnapping, setIsSnapping] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isToggle = e.code === 'KeyG' || e.code === 'KeyP'

    if (e.metaKey && e.key === 'Backspace') {
      for (const selectedId of uiState.selectedIds) {
        removeFromStore(selectedId)
      }
    }

    if (e.metaKey && e.code === 'KeyG') {
      toggleSnapToGrid()
    }

    if (isToggle && e.repeat) return

    switch (e.code) {
      case 'KeyG':
        toggleGrid()
        break
      case 'KeyP':
        toggleComponentPanel()
        break
    }

    const activeNode = uiState.activeNode
    const itemProxy = activeNode
      ? diagramHistory.value.items.find((i) => i.id === activeNode.id)
      : null

    switch (e.key) {
      case ' ':
        setIsPanning(true)
        break
      case 'Shift':
        console.log('heeelooo')
        setIsSnapping(true)
        break
      case 'ArrowRight':
        if (itemProxy) itemProxy.x += 32
        break
      case 'ArrowLeft':
        if (itemProxy) itemProxy.x -= 32
        break
      case 'ArrowUp':
        if (itemProxy) itemProxy.y -= 32
        break
      case 'ArrowDown':
        if (itemProxy) itemProxy.y += 32
        break
      case 'Escape':
        uiState.action = null
        break
      case 'Return':
        uiState.action = null
        break
      default:
        break
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ') {
      setIsPanning(false)
    }
    if (e.key === 'Shift') {
      setIsSnapping(false)
    }
  }

  return { isPanning, isSnapping, handleKeyDown, handleKeyUp }
}
