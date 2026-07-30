import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/features/shared/ui/dialog'
import { Kbd, KbdGroup } from '@/features/shared/ui/kbd'
import {
  LucideIcon,
  Move,
  Settings,
  SquareDashedMousePointer,
  View,
} from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { SHORTCUTS } from '../constants/shortcuts'

type ShortcutCategory = 'general' | 'selection' | 'movement' | 'view'

export const ShortcutsDialog = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'keyboard-shortcuts',
  })

  const isMac = navigator.userAgent.toLowerCase().includes('mac')
  const modKey = isMac ? '⌘' : 'Ctrl'

  const CATEGORY_ORDER = ['general', 'selection', 'movement', 'view'] as const
  const CATEGORY_ICONS = {
    general: { icon: Settings },
    selection: { icon: SquareDashedMousePointer },
    movement: { icon: Move },
    view: { icon: View },
  } satisfies Record<ShortcutCategory, { icon: LucideIcon }>

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <form>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          {CATEGORY_ORDER.map((category) => {
            const Icon = CATEGORY_ICONS[category].icon
            const shortcuts = SHORTCUTS[category]

            return (
              <section
                key={category}
                className="border-muted-background border- flex w-full flex-col py-2"
              >
                <h3 className="flex flex-row items-center gap-x-2 text-sm text-muted-foreground">
                  <span>
                    <Icon className="h-4 w-4" />
                  </span>
                  {t(`categories.${category}`)}
                </h3>

                {shortcuts.map((shortcut) => {
                  const keyLabels = shortcut.displayKeys
                    ? shortcut.displayKeys
                    : [t(`keys.${shortcut.key}`)]

                  return (
                    <div
                      className="flex justify-between pt-2"
                      key={`${shortcut.key}-${shortcut.action}`}
                    >
                      <span>{t(`actions.${shortcut.action}`)}</span>

                      <KbdGroup>
                        {shortcut.mod && (
                          <>
                            <Kbd>{modKey}</Kbd>
                            <span>+</span>
                          </>
                        )}

                        {keyLabels.map((keyLabel) => (
                          <Kbd key={keyLabel}>{keyLabel}</Kbd>
                        ))}
                      </KbdGroup>
                    </div>
                  )
                })}
              </section>
            )
          })}
        </DialogContent>
      </form>
    </Dialog>
  )
}
