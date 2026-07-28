import { Button } from '@/features/shared/ui/button'
import { GripVertical, X } from 'lucide-react'

type FloatingPanelHeaderProps = {
  dragHandleClassName: string
  onClose: () => void
}

export const FloatingPanelHeader = ({
  dragHandleClassName,
  onClose,
}: FloatingPanelHeaderProps) => {
  return (
    <div className="flex h-10 shrink-0 items-center gap-x-8 border-b border-dashed border-muted-foreground/40 px-3">
      <span
        className={`${dragHandleClassName} grow cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing active:text-foreground`}
      >
        <GripVertical className="size-4" />
      </span>

      <Button
        variant="ghost"
        size="icon"
        className="size-8 flex-none text-muted-foreground hover:bg-transparent hover:text-foreground"
        onClick={onClose}
      >
        <X className="size-4" />
        <span className="sr-only">Lukk panel</span>
      </Button>
    </div>
  )
}
