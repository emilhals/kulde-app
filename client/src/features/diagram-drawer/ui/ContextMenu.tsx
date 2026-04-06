import { removeFromStore } from '@/features/diagram-drawer/store/actions'
import { diagramHistory, uiState } from '@/features/diagram-drawer/store/models'
import { Connection, Point } from '@/features/diagram-drawer/types'
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
import {
    Bold,
    ChevronDown,
    ChevronUp,
    Italic,
    Trash2,
    Underline,
    X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CirclePicker } from 'react-color'
import { useTranslation } from 'react-i18next'
import { useSnapshot } from 'valtio'
import { ShowConnection } from './ShowConnection'

const hasConnections = (conn: Connection) => {
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
    position: Point | null
    onClose: () => void
}) => {
    const [newAttachedText, setNewAttachedText] = useState<string>('')

    const [textContentOpen, setTextContentOpen] = useState<boolean>(true)
    const [connectionsContentOpen, setConnectionsContentOpen] =
        useState<boolean>(true)

    const inputRef = useRef<HTMLInputElement>(null)

    const { t } = useTranslation()

    useEffect(() => {
        if (position) {
            inputRef.current?.focus()
        }
    }, [position])

    const diagramSnap = useSnapshot(diagramHistory)
    if (!diagramSnap) return null

    const activeNode = uiState.activeNode
    if (!activeNode) return null

    const item = diagramSnap.value.items.find(
        (item) => item.id === activeNode.id,
    )
    const itemProxy = diagramHistory.value.items.find(
        (item) => item.id === activeNode.id,
    )
    if (!item || !itemProxy) return null

    const attachedText = diagramSnap.value.texts.find(
        (text) =>
            text.anchor?.type === 'item' && text.anchor.itemId === item.id,
    )
    const attachedTextProxy = diagramHistory.value.texts.find(
        (text) =>
            text.anchor?.type === 'item' && text.anchor.itemId === item.id,
    )
    if (!attachedText || !attachedTextProxy) return null

    const connections = diagramHistory.value.connections.filter((conn) =>
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
            onClick={(e) => e.stopPropagation()}
            id="contextmenu"
            className={`z-50 relative shrink-0 top-0 right-0 h-full w-56  bg-white border border-gray-300 rounded-lg
        ${position ? '' : 'hidden'}
      `}
        >
            <button
                className="absolute top-0 left-0 px-2 py-2 bg-transparent text-gray-500 hover:text-gray-900"
                onClick={onClose}
            >
                <X className="bg-transparent" size={12} />
            </button>

            <div className="flex flex-col py-4 px-2   h-full w-full rounded-lg">
                <div className="flex flex-col items-center justify-center">
                    <h3 className=" text-lg font-semibold">
                        <div>{t('cm.header')}</div>
                    </h3>
                    <span className="text-gray-400 text-sm italic ">
                        {item.component}
                    </span>
                </div>

                <div className="py-3"></div>

                <Collapsible
                    open={textContentOpen}
                    onOpenChange={setTextContentOpen}
                    className="flex flex-col gap-2"
                >
                    <CollapsibleTrigger className="flex flex-row items-center gap-x-2">
                        <span>
                            {textContentOpen ? (
                                <ChevronUp size={16} />
                            ) : (
                                <ChevronDown size={16} />
                            )}
                        </span>
                        <h3 className="text-md font-medium">{t('cm.text')}</h3>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col gap-2 items-center justify-center">
                        {attachedText ? (
                            <div className="flex flex-col gap-2">
                                <div>
                                    <input
                                        className="flex py-2 px-2 w-48 bg-gray-30 text-sm text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 rounded-sm shadow-inner shadow-gray-100 focus:outline-1 focus:outline-black"
                                        placeholder="Enter label"
                                        value={attachedText?.content ?? ''}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                            const value = e.target.value

                                            if (!attachedTextProxy) return
                                            attachedTextProxy.content = value
                                        }}
                                        type="text"
                                        ref={inputRef}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 max-w-48 ">
                                    <h3 className="text-sm font-semibold">
                                        {t('cm.color')}
                                    </h3>
                                    <div className="flex justify-center px-2 ">
                                        <CirclePicker
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
                                                (attachedTextProxy.color =
                                                    color.hex)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-sm font-semibold">
                                        {t('cm.attributes')}
                                    </h3>
                                    <ToggleGroup
                                        variant="outline"
                                        type="multiple"
                                        size="sm"
                                        value={attachedTextProxy.attributes}
                                        onValueChange={(value) =>
                                            (attachedTextProxy.attributes =
                                                value)
                                        }
                                    >
                                        <ToggleGroupItem
                                            value="bold"
                                            aria-label="Toggle bold"
                                        >
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
                                            aria-label="Toggle italic"
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
                                            {diagramSnap.value.texts.map(
                                                (text) => (
                                                    <SelectItem
                                                        key={text.content}
                                                        value={text.id}
                                                    >
                                                        {text.content}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAttachText}>
                                    {t('cm.attach')}
                                </Button>
                            </>
                        )}
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible
                    open={connectionsContentOpen}
                    onOpenChange={setConnectionsContentOpen}
                    className="flex flex-col gap-2 py-2"
                >
                    <CollapsibleTrigger className="flex flex-row items-center gap-x-2">
                        <span>
                            {connectionsContentOpen ? (
                                <ChevronUp size={16} />
                            ) : (
                                <ChevronDown size={16} />
                            )}
                        </span>
                        <h3 className="text-md font-medium">
                            {t('cm.connections')}
                        </h3>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {connections.length >= 1 ? (
                            <>
                                {connections.map((conn) => (
                                    <ShowConnection
                                        key={conn.id}
                                        connection={conn}
                                        source={item.id}
                                    />
                                ))}
                            </>
                        ) : (
                            <p className="text-sm text-gray-400 text-center italic">
                                {t('cm.no-connections')}.
                            </p>
                        )}
                    </CollapsibleContent>
                </Collapsible>
            </div>

            <div className="absolute bottom-0 w-full px-4 py-4">
                <div className="flex flex-row items-center justify-center">
                    <button
                        className="w-56 bg-rose-500 px-4 py-2 rounded-md text-white hover:bg-rose-600 "
                        onClick={() => {
                            removeFromStore(itemProxy.id)
                            uiState.activeNode = null
                            onClose()
                        }}
                    >
                        <span className="flex justify-center items-center gap-x-2">
                            <Trash2 size={12} />
                            {t('cm.delete')}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ContextMenu
