import { removeFromStore } from '@/features/diagram-drawer/store/actions'
import { diagramHistory, uiState } from '@/features/diagram-drawer/store/models'
import {
  Attribute,
  ConnectionData,
  Point,
} from '@/features/diagram-drawer/types'
import { Button } from '@/shared/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/collapsible'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group'
import { Bold, ChevronDown, Italic, Trash2, Underline, X } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { CirclePicker } from 'react-color'
import { useTranslation } from 'react-i18next'
import { useSnapshot } from 'valtio'
import { EditConnection } from '@/features/diagram-drawer/ui/ShowConnection'
import { cn } from '@/lib/utils'
import { Input } from '@/shared/ui/input'
import { ScrollArea } from '@/shared/ui/scroll-area'

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

  const [newAttachedText, setNewAttachedText] = useState('')

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

  const handleAttachText = () => {
    const textProxy = diagramHistory.value.texts.find(
      (t) => t.id === newAttachedText,
    )
    if (!textProxy) return

    textProxy.anchor = {
      itemId: item.id,
      type: 'item',
      offset: {
        x: textProxy.position.x - itemProxy.x,
        y: textProxy.position.y - itemProxy.y,
      },
    }
  }

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
        className="absolute top-2 right-2 w-7 h-7 hover:bg-transparent text-muted-foreground dark:hover:bg-transparent hover:text-foreground"
        onClick={onClose}
      >
        <X size={12} />
      </Button>

      <div className="py-2 px-2 pt-2 border-b shrink-0">
        <div className="flex flex-col justify-center items-center">
          <h2 className="font-sans text-lg font-semibold">{t('cm.header')}</h2>
          <p className="font-mono text-sm text-muted-foreground">
            {t(`symbols.${item.component}`)}
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="w-full h-full">
          <div className="py-1 pr-3 pl-2 space-y-2 w-full min-w-0">
            <Collapsible
              open={textContentOpen}
              onOpenChange={setTextContentOpen}
              className="flex flex-col gap-2"
            >
              <CollapsibleTrigger className="flex gap-2 items-center w-full transition-colors text-muted-foreground hover:text-foreground">
                <h3 className="font-medium">{t('cm.text')}</h3>
                <ChevronDown
                  size={16}
                  className={cn(
                    'ml-auto shrink-0 transition-transform',
                    textContentOpen && 'rotate-180',
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-2 justify-center items-center">
                {attachedText && attachedTextProxy ? (
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
                      <div className="flex justify-center w-full">
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
                ) : (
                  <>
                    <Select
                      value={newAttachedText}
                      onValueChange={setNewAttachedText}
                    >
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Attach text" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Texts</SelectLabel>
                          {diagramSnap.value.texts.map((text) => (
                            <SelectItem key={text.id} value={text.id}>
                              {text.content || t('cm.untitled-text')}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAttachText}>{t('cm.attach')}</Button>
                  </>
                )}
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={connectionsContentOpen}
              onOpenChange={setConnectionsContentOpen}
              className="flex flex-col gap-2 py-2"
            >
              <CollapsibleTrigger className="flex gap-2 items-center w-full transition-colors text-muted-foreground hover:text-foreground">
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
                  <div className="pr-1 space-y-1">
                    {connections.map((conn) => (
                      <EditConnection
                        key={conn.id}
                        connection={conn}
                        source={item.id}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-center text-gray-400">
                    {t('cm.no-connections')}.
                  </p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
      </div>

      <div className="py-2 px-4 border-t shrink-0">
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
