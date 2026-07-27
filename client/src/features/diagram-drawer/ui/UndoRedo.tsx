import { Undo2, Redo2 } from 'lucide-react'

import { diagramHistory } from '@/features/diagram-drawer/store/diagram-state'
import { useSnapshot } from 'valtio/react'
import { Button } from '@/shared/ui/button'

export const UndoRedo = () => {
  const diagramSnap = useSnapshot(diagramHistory)

  return (
    <div className="flex flex-row gap-2">
      <Button
        size="icon"
        variant="outline"
        disabled={!diagramSnap.isUndoEnabled}
        onClick={() => diagramHistory.undo()}
      >
        <Undo2 aria-hidden="true" size={16} />
      </Button>

      <Button
        size="icon"
        variant="outline"
        disabled={!diagramSnap.isRedoEnabled}
        onClick={() => diagramHistory.redo()}
      >
        <Redo2 aria-hidden="true" size={16} />
      </Button>
    </div>
  )
}
