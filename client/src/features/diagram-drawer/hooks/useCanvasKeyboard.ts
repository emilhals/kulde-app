import { RefObject, useState } from 'react'
import { uiState } from '@/features/diagram-drawer/store/ui-state'
import { diagramHistory } from '@/features/diagram-drawer/store/diagram-state'
import Konva from 'konva'
import { removeFromStore } from '@/features/diagram-drawer/store/actions'

export const useCanvasKeyboard = (stageRef: RefObject<Konva.Stage>) => {
  const [isPanning, setIsPanning] = useState(false)
  const [isSnapping, setIsSnapping] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const activeElement = document.activeElement

    if (activeElement?.tagName === 'INPUT') {
      return
    }

    if (e.metaKey && e.key === 'Backspace') {
      for (const selectedId of uiState.selectedIds) {
        removeFromStore(selectedId)
      }
    }

    if (
      [
        ' ',
        'Shift',
        'ArrowRight',
        'ArrowLeft',
        'ArrowUp',
        'ArrowDown',
        'Escape',
      ].includes(e.key)
    ) {
      e.preventDefault()
    } else {
      return
    }

    const activeNode = uiState.activeNode
    const itemProxy = activeNode
      ? diagramHistory.value.items.find((i) => i.id === activeNode.id)
      : null

    const container = stageRef.current?.container()
    if (!container) return

    switch (e.key) {
      case ' ':
        setIsPanning(true)
        container.style.cursor = 'grab'
        break
      case 'Shift':
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
      const container = stageRef.current?.container()
      if (container) container.style.cursor = 'default'
    }
    if (e.key === 'Shift') {
      setIsSnapping(false)
    }
  }

  return { isPanning, isSnapping, handleKeyDown, handleKeyUp }
}
