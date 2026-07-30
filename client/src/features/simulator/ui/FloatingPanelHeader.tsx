import { useTheme } from '@/features/shared/contexts/theme-provider'
import { Button } from '@/features/shared/ui/button'
import { cn } from '@/lib/utils'
import { GripVertical, Pin, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { movePanel, setPanelPosition } from '../stores/ui.actions'

type FloatingPanelHeaderProps = {
  dragHandleClassName: string
  title: 'parameters' | 'instructions'
  isPinned: boolean
  onPin: () => void
  onClose: () => void
}

export const FloatingPanelHeader = ({
  dragHandleClassName,
  title,
  isPinned,
  onPin,
  onClose,
}: FloatingPanelHeaderProps) => {
  const { t } = useTranslation('simulator', { keyPrefix: 'panel' })
  const { theme } = useTheme()

  const fillColor = theme === 'light' ? '#000' : '#fff'
  const nonFillColor = theme === 'light' ? '#fff' : '#000'

  return (
    <div
      tabIndex={0}
      aria-label={t('move-panel')}
      className="flex h-10 shrink-0 items-center border-b border-dashed border-muted-foreground/40 px-3"
      onKeyDown={(e) => {
        const step = e.shiftKey ? 20 : 5

        switch (e.code) {
          case 'ArrowUp':
            movePanel(title, { x: 0, y: -step })
            break
          case 'ArrowDown':
            movePanel(title, { x: 0, y: step })
            break
          case 'ArrowLeft':
            movePanel(title, { x: -step, y: 0 })
            break
          case 'ArrowRight':
            movePanel(title, { x: step, y: 0 })
            break
          default:
            return
        }

        e.preventDefault()
      }}
    >
      <div
        className={cn(
          dragHandleClassName,
          'group flex grow cursor-grab items-center gap-2',
          'text-muted-foreground transition-colors',
          'hover:text-foreground active:cursor-grabbing',
        )}
      >
        <GripVertical aria-hidden="true" className="size-4" />
        <h2 className="text-sm font-medium">{t(`${title}`)}</h2>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
        onClick={onPin}
        aria-label={isPinned ? t('unpin-panel') : t('pin-panel')}
      >
        <Pin
          fill={isPinned ? fillColor : nonFillColor}
          aria-hidden="true"
          className="size-4 hover:cursor-pointer hover:text-foreground"
        />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
        onClick={onClose}
        aria-label={t('close-panel')}
      >
        <X aria-hidden="true" className="size-4" />
      </Button>
    </div>
  )
}
