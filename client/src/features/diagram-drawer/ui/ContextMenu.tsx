import { useState, useRef, useEffect } from 'react'

import { Lock, LockOpen, Trash2, Copy } from 'lucide-react'

import {
    removeFromStore,
    addToStore,
    diagramHistory,
    uiState,
} from '@/features/diagram-drawer/store'
import { useSnapshot } from 'valtio'

import { PointType } from '@/features/diagram-drawer/types'

export const ContextMenu = ({ position }: { position: PointType }) => {
    const diagramSnap = useSnapshot(diagramHistory)

    const [show, setShow] = useState<boolean>(true)

    const item = diagramSnap.value.items.find(
        (item) => item.id === uiState.selected?.id,
    )

    const itemProxy = diagramHistory.value.items.find(
        (item) => item.id === uiState.selected?.id,
    )

    const attachedText = diagramSnap.value.texts.find(
        (text) =>
            text.anchor?.type === 'item' && text.anchor.itemId === item?.id,
    )
    const attachedTextProxy = diagramHistory.value.texts.find(
        (text) =>
            text.anchor?.type === 'item' && text.anchor.itemId === item?.id,
    )

    const [textValue, setTextValue] = useState(attachedText?.content ?? '')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (show) {
            inputRef.current?.focus()
        }
    }, [show])

    useEffect(() => {
        setTextValue(attachedText?.content ?? '')
    }, [attachedText?.id])

    if (!item || !itemProxy) return null

    const handleDuplicate = () => {
        const duplicatedItem = addToStore({
            type: 'items',
            component: item.component,
            height: item.height,
            width: item.width,
            x: item.x,
            y: item.y - item.height * 1.5,
            locked: item.locked,
            anchors: {
                position: [...item.anchors.position],
                offset: { ...item.anchors.offset },
            },
        })

        if (duplicatedItem?.type !== 'items') return null

        if (attachedText) {
            addToStore({
                type: 'texts',
                content: attachedText.content,
                position: { x: duplicatedItem.x, y: duplicatedItem.y },
                size: attachedText.size,
                attributes: attachedText.attributes
                    ? [...attachedText.attributes]
                    : undefined,
                anchor: {
                    type: 'item',
                    itemId: duplicatedItem.id,
                    placement: 'Top',
                    offset: { x: 0, y: -8 },
                },
            })
        }
    }

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            style={{
                position: 'fixed',
                top: position.y,
                left: position.x,
                zIndex: 10,
                backgroundColor: 'white',
            }}
            id="contextmenu"
            className={`
        border-2 rounded-md  
        ${show ? '' : 'hidden'}
      `}
        >
            <div className="relative inline-block text-sm leading-5 tracking-tight">
                <div className="flex flex-row px-2 items-center justify-center py-2">
                    <input
                        className="block py-2 px-2 bg-gray-30 text-sm text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 rounded-sm shadow-inner shadow-gray-100 focus:outline-1 focus:outline-skyblue"
                        placeholder="Enter label"
                        value={textValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setTextValue(e.target.value)
                        }}
                        onBlur={() => {
                            if (!attachedTextProxy) return
                            attachedTextProxy.content = textValue
                        }}
                        type="text"
                        ref={inputRef}
                    />
                </div>

                <div className="flex flex-col border-t-2 py-2">
                    <button
                        onClick={handleDuplicate}
                        className="group flex py-2 items-center justify-center hover:bg-gray-50"
                    >
                        <Copy className="absolute left-3" size={12} />
                        Duplicate object
                    </button>

                    <button
                        onClick={() => (itemProxy.locked = !itemProxy.locked)}
                        className="group py-2 flex items-center justify-center hover:bg-gray-50"
                    >
                        {itemProxy.locked ? 'Unlock object' : 'Lock object'}
                        {itemProxy.locked ? (
                            <LockOpen className="absolute left-3" size={13} />
                        ) : (
                            <Lock className="absolute left-3" size={13} />
                        )}
                    </button>
                </div>

                <div className="border-t-2 py-2">
                    <button
                        onClick={() => {
                            removeFromStore(itemProxy)
                            uiState.selected = null
                            setShow(false)
                        }}
                        className="group flex justify-center items-center text-red-600 w-full px-4 py-2 hover:bg-gray-50"
                    >
                        <Trash2 className="absolute left-3" size={13} />
                        Delete object
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ContextMenu
