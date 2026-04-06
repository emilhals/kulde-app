import { diagramHistory } from '@/features/diagram-drawer/store/models'
import { Text } from '@/features/diagram-drawer/types'
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'
import { useRef, useState } from 'react'
import { Group, Text as KonvaText } from 'react-konva'
import { Html } from 'react-konva-utils'
import { useSnapshot } from 'valtio'

export const TextNode = ({ text }: { text: Text }) => {
    const textRef = useRef<Konva.Text>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [canEdit, setCanEdit] = useState<boolean>(false)
    const [editedText, setEditedText] = useState<string>('')

    const diagramSnap = useSnapshot(diagramHistory)
    if (!diagramSnap) return null

    const textProxy = diagramHistory.value.texts.find((t) => t.id === text.id)
    if (!textProxy) return null

    const anchor = textProxy.anchor

    const anchoredItem =
        anchor && anchor.type === 'item'
            ? diagramHistory.value.items.find((i) => i.id === anchor.itemId)
            : null

    const x =
        anchoredItem && textRef.current
            ? anchoredItem.x +
              anchoredItem.width / 2 -
              textRef.current?.width() / 2
            : textProxy.position.x
    const y =
        anchoredItem && anchor
            ? anchoredItem.y + anchor.offset.y
            : textProxy.position.y

    const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
        const stage = e.target.getStage()
        if (!stage) return
    }

    const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
        if (!textProxy) return null
        textProxy.position.x = e.target.getAbsolutePosition().x
        textProxy.position.y = e.target.getAbsolutePosition().y

        if (!textProxy.anchor?.itemId) return
        const item = diagramSnap.value.items.find(
            (item) => item.id === textProxy.anchor?.itemId,
        )
        if (!item) return

        const dx = text.position.x - item.x
        const dy = text.position.y - item.y

        const distance = Math.sqrt(dx * dx + dy * dy)
    }

    const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
        if (!textProxy) return null

        textProxy.position.x = e.target.getAbsolutePosition().x
        textProxy.position.y = e.target.getAbsolutePosition().y
    }

    const handleDoubleClick = () => {
        setCanEdit(!canEdit)
        textRef.current?.visible(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const key = e.key

        if (key === 'Enter') {
            console.log('hei')
            setCanEdit(false)
            textRef.current?.visible(true)
            textProxy.content = editedText
        }
        if (key === 'Escape') {
            setCanEdit(false)
            textRef.current?.visible(true)
        }
    }

    return (
        <Group>
            <KonvaText
                ref={textRef}
                id={text.id}
                x={x}
                y={y}
                align="center"
                draggable
                text={text.content}
                fontFamily={'Inter'}
                fill={text.color}
                textDecoration={text.attributes
                    ?.filter((attr) => attr === 'underline')
                    .join('')}
                fontStyle={textProxy.attributes
                    ?.filter((attr) => attr !== 'underline')
                    .join(' ')}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                onDblClick={handleDoubleClick}
                fontSize={14}
            />

            {canEdit && (
                <Html>
                    <input
                        ref={inputRef}
                        defaultValue={text.content}
                        onChange={(e) => {
                            setEditedText(e.target.value)
                        }}
                        onKeyDown={handleKeyDown}
                        className="absolute border-0"
                        style={{
                            border: 'none',
                            background: 'none',
                            padding: '0px',
                            margin: '0px',
                            outline: 'none',
                            resize: 'none',
                            textDecoration: 'underline',
                            transform: 'translateY(-5px)',
                            top: `${textRef.current?.y()}px`,
                            left: `${textRef.current?.x()}px`,
                            color: 'color',
                        }}
                    />
                </Html>
            )}
        </Group>
    )
}
