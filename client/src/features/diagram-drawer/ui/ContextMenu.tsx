import { removeFromStore } from '@/features/diagram-drawer/store/actions'
import { diagramHistory } from '@/features/diagram-drawer/store/diagram-state'
import { uiState } from '@/features/diagram-drawer/store/ui-state'
import {
  Attribute,
  ConnectionData,
  Point,
} from '@/features/diagram-drawer/types'
import { EditConnection } from '@/features/diagram-drawer/ui/EditConnection'
import { Button } from '@/features/shared/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/features/shared/ui/collapsible'
import { Input } from '@/features/shared/ui/input'
import { ScrollArea } from '@/features/shared/ui/scroll-area'
import { ToggleGroup, ToggleGroupItem } from '@/features/shared/ui/toggle-group'
import { cn } from '@/lib/utils'
import { Bold, ChevronDown, Italic, Trash2, Underline, X } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { CirclePicker } from 'react-color'
import { useTranslation } from 'react-i18next'
import { useSnapshot } from 'valtio'

const hasConnections = (conn: ConnectionData) => {
  const activeNode = uiState.activeNode
  if (!activeNode) return null

  return (
    (conn.from.type === 'item' && conn.from.itemId === activeNode.id) ||
    (conn.to.type === 'item' && conn.to.itemId === activeNode.id)
  )
}

export const ContextMenu = ({
  position,
  onClose,
}: {
  position: Point
  onClose: () => void
}) => {
  const { t } = useTranslation()
  const diagramSnap = useSnapshot(diagramHistory)

  const [textContentOpen, setTextContentOpen] = useState(true)
  const [connectionsContentOpen, setConnectionsContentOpen] = useState(true)

  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const [clampedPosition, setClampedPosition] = useState(position)

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const container = panel.parentElement
    if (!container) return

    const clamp = () => {
      const padding = 8

      setClampedPosition({
        x: Math.min(
          Math.max(position.x, padding),
          container.clientWidth - panel.offsetWidth - padding,
        ),
        y: Math.min(
          Math.max(position.y, padding),
          container.clientHeight - panel.offsetHeight - padding,
        ),
      })
    }

    clamp()

    const observer = new ResizeObserver(clamp)
    observer.observe(panel)

    return () => {
      observer.disconnect()
    }
  }, [position])

  const activeNode = uiState.activeNode
  if (!activeNode) return null

  const item = diagramSnap.value.items.find((item) => item.id === activeNode.id)
  const itemProxy = diagramHistory.value.items.find(
    (item) => item.id === activeNode.id,
  )
  if (!item || !itemProxy) return null

  const attachedText = diagramSnap.value.texts.find(
    (text) => text.anchor?.type === 'item' && text.anchor.itemId === item.id,
  )
  const attachedTextProxy = attachedText
    ? diagramHistory.value.texts.find(
        (text) =>
          text.anchor?.type === 'item' && text.anchor.itemId === item.id,
      )
    : undefined

  const connections = diagramSnap.value.connections.filter((conn) =>
    hasConnections(conn),
  )

  return (
    <div
      ref={panelRef}
      onClick={(e) => {
        e.stopPropagation()
      }}
      id="contextmenu"
      className={
        'absolute z-50 flex w-60 flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800 dark:shadow-slate-900'
      }
      style={{
        left: clampedPosition.x,
        top: clampedPosition.y,
        maxHeight: `calc(100% - 16px)`,
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-7 w-7 text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent"
        onClick={onClose}
      >
        <X size={12} />
      </Button>

      <div className="shrink-0 border-b px-2 py-2 pt-2">
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-sans text-base font-semibold">
            {t('cm.header')}
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            {t(`symbols.${item.component}`)}
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full w-full">
          <div className="w-full min-w-0 space-y-2 py-1 pl-2 pr-3">
            <Collapsible
              open={textContentOpen}
              onOpenChange={setTextContentOpen}
              className="flex flex-col gap-2"
            >
              <CollapsibleTrigger className="flex w-full items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <h3 className="font-medium">{t('cm.text')}</h3>
                <ChevronDown
                  size={16}
                  className={cn(
                    'ml-auto shrink-0 transition-transform',
                    textContentOpen && 'rotate-180',
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col items-center justify-center gap-2">
                {attachedText && attachedTextProxy && (
                  <div className="flex flex-col gap-2">
                    <Input
                      className="dark:border-slate-700"
                      placeholder={t('cm.enter-label')}
                      value={attachedTextProxy.content}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value

                        attachedTextProxy.content = value
                      }}
                      ref={inputRef}
                    />
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {t('cm.color')}
                      </p>
                      <div className="flex w-full justify-center">
                        <CirclePicker
                          width="80%"
                          circleSize={28}
                          circleSpacing={12}
                          color={attachedText.color}
                          colors={[
                            '#000000',
                            '#FF0000',
                            '#FFA500',
                            '#FFFF00',
                            '#008000',
                            '#0000FF',
                            '#800080',
                            '#808080',
                          ]}
                          onChangeComplete={(color) =>
                            (attachedTextProxy.color = color.hex)
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold">
                        {t('cm.attributes')}
                      </p>
                      <ToggleGroup
                        variant="outline"
                        type="multiple"
                        size="sm"
                        value={[...attachedTextProxy.attributes]}
                        onValueChange={(value) =>
                          (attachedTextProxy.attributes = [
                            ...value,
                          ] as Attribute[])
                        }
                      >
                        <ToggleGroupItem value="bold" aria-label="Toggle bold">
                          <Bold size={12} />
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="italic"
                          aria-label="Toggle italic"
                        >
                          <Italic size={12} />
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="underline"
                          aria-label="Toggle underline"
                        >
                          <Underline size={12} />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={connectionsContentOpen}
              onOpenChange={setConnectionsContentOpen}
              className="flex flex-col gap-2 py-2"
            >
              <CollapsibleTrigger className="flex w-full items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <h3 className="text-base font-medium">{t('cm.connections')}</h3>
                <ChevronDown
                  size={16}
                  className={cn(
                    'ml-auto shrink-0 transition-transform',
                    connectionsContentOpen && 'rotate-180',
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                {connections.length >= 1 ? (
                  <div className="space-y-1 pr-1">
                    {connections.map((conn) => (
                      <EditConnection
                        key={conn.id}
                        connection={conn}
                        source={item.id}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm italic text-gray-400">
                    {t('cm.no-connections')}.
                  </p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
      </div>

      <div className="shrink-0 border-t px-4 py-2">
        <div className="flex justify-center">
          <Button
            variant="destructive"
            onClick={() => {
              removeFromStore(itemProxy.id)
              uiState.activeNode = null
              onClose()
            }}
          >
            <Trash2 size={12} />
            {t('cm.delete')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ContextMenu
