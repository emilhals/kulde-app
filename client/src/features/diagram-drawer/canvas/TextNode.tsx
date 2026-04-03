import { diagramHistory } from '@/features/diagram-drawer/store/models'
import { Item, Text as TextType } from '@/features/diagram-drawer/types'
import Konva from 'konva'
import { useRef, useState } from 'react'
import { Group, Text as KonvaText } from 'react-konva'
import { Html } from 'react-konva-utils'

export const TextNode = ({ parent }: { parent: Item | TextType }) => {
    const textRef = useRef<Konva.Text>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [canEdit, setCanEdit] = useState<boolean>(false)
    const [editedText, setEditedText] = useState<string>('')

    const textProxy = diagramHistory.value.texts.find(
        (text) => text.id === parent.id,
    )
    if (!textProxy) return null

    const anchor = textProxy.anchor

    const anchoredItem =
        anchor && anchor.type === 'item'
            ? diagramHistory.value.items.find((i) => i.id === anchor.itemId)
            : null

    const x = anchoredItem
        ? anchoredItem.x + anchoredItem.width / 2
        : textProxy.position.x

    const y =
        anchoredItem && anchor
            ? anchoredItem.y + anchor.offset.y
            : textProxy.position.y

    const handleDragStart = () => {
        // Detach text from anchor on drag
        if (textProxy.anchor) {
            textProxy.anchor = undefined
        }
    }

    const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
        if (!textProxy) return null
        textProxy.position.x = e.target.getAbsolutePosition().x
        textProxy.position.y = e.target.getAbsolutePosition().y
    }

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
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
                id={parent.id}
                x={x}
                y={y}
                align="center"
                width={200}
                offsetX={100}
                draggable
                text={textProxy?.content}
                fontFamily={'Inter'}
                textDecoration={textProxy.attributes
                    ?.filter((attr) => attr === 'underline')
                    .join('')}
                fontStyle={textProxy.attributes
                    ?.filter((attr) => attr !== 'underline')
                    .join(' ')}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                onDblClick={handleDoubleClick}
                fontSize={16}
            />

            {canEdit && (
                <Html>
                    <input
                        ref={inputRef}
                        defaultValue={textProxy?.content}
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
