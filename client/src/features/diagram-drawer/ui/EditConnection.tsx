import { ArrowMode, ConnectionData } from '@/features/diagram-drawer/types'
import {
  ArrowLeftRight,
  ChevronDown,
  Minus,
  MoveLeft,
  MoveRight,
  Trash2,
} from 'lucide-react'
import { diagramHistory } from '@/features/diagram-drawer/store/models'
import { getAttachmentId } from '@/features/diagram-drawer/utils/attachments'
import { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/collapsible'
import { cn } from '@/lib/utils'
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/button'
import { removeFromStore } from '../store/actions'
import { Label } from '@/shared/ui/label'
import { Input } from '@/shared/ui/input'

export const EditConnection = ({
  connection,
  source,
}: {
  connection: ConnectionData
  source: string
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const fromProxy = diagramHistory.value.items.find(
    (i) => i.id === getAttachmentId(connection.from),
  )
  if (!fromProxy) return null

  const fromTextProxy = diagramHistory.value.texts.find(
    (t) => t.anchor?.itemId === fromProxy.id,
  )

  // to can be both an item and a connection
  const toItemProxy = diagramHistory.value.items.find(
    (i) => i.id === getAttachmentId(connection.to),
  )
  if (!toItemProxy) return null

  const toTextProxy = diagramHistory.value.texts.find(
    (t) => t.anchor?.itemId === toItemProxy.id,
  )

  const sourceIsFrom = source === fromProxy.id
  const leftLabel = sourceIsFrom
    ? fromTextProxy?.content || fromProxy.component
    : toTextProxy?.content || toItemProxy.component

  const rightLabel = sourceIsFrom
    ? toTextProxy?.content || toItemProxy.component
    : fromTextProxy?.content || fromProxy.component

  const connectionProxy = diagramHistory.value.connections.find(
    (item) => item.id === connection.id,
  )
  if (!connectionProxy) return null

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="overflow-hidden w-full min-w-0 rounded-md border"
    >
      <CollapsibleTrigger className="flex gap-2 items-center py-2 px-2 w-full min-w-0 max-w-full text-left">
        <div className="flex flex-1 gap-1 items-center min-w-0 font-mono text-xs">
          <span className="flex-1 min-w-0 truncate">{leftLabel}</span>

          <MoveRight
            size={14}
            className={cn('shrink-0', !sourceIsFrom && 'rotate-180')}
          />

          <span className="flex-1 min-w-0 truncate">{rightLabel}</span>
        </div>

        <ChevronDown
          size={14}
          className={cn(
            'shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up min-w-0 max-w-full overflow-hidden border-t px-2 py-2">
        <div className="flex flex-col gap-2 w-full min-w-0 max-w-full">
          <div>
            <p className="text-sm font-medium text-foreground">
              {t('cm.arrowheads')}
            </p>

            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={connectionProxy.arrowMode}
              onValueChange={(value: ArrowMode) => {
                if (!value) return
                connectionProxy.arrowMode = value
              }}
              className="grid grid-cols-4 gap-1 w-full"
            >
              <ToggleGroupItem
                className="px-0 w-full min-w-0"
                value="none"
                aria-label={t('cm.arrow-none')}
              >
                <Minus size={14} />
              </ToggleGroupItem>

              <ToggleGroupItem
                className="px-0 w-full min-w-0"
                value="start"
                aria-label={t('cm.arrow-start')}
              >
                <MoveLeft size={14} />
              </ToggleGroupItem>

              <ToggleGroupItem
                className="px-0 w-full min-w-0"
                value="end"
                aria-label={t('cm.arrow-end')}
              >
                <MoveRight size={14} />
              </ToggleGroupItem>

              <ToggleGroupItem
                className="px-0 w-full min-w-0"
                value="both"
                aria-label={t('cm.arrow-both')}
              >
                <ArrowLeftRight size={14} />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`connection-label-${connection.id}`}>
              {t('cm.connection-label')}
            </Label>

            <Input
              id={`connection-label-${connection.id}`}
              value={connectionProxy.label}
              placeholder={t('cm.connection-label-placeholder')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                connectionProxy.label = e.target.value
              }}
            />
          </div>

          <div className="flex justify-start mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                removeFromStore(connection.id)
              }}
            >
              <Trash2 size={14} />
              {t('cm.delete-connection')}
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
