import { useRef, useState, useLayoutEffect } from 'react'

import Konva from 'konva'
import { Group, Text as KonvaText } from 'react-konva'
import { Html } from 'react-konva-utils'

import { diagramHistory } from '@/features/diagram-drawer/store'

import { ItemType, TextType } from '@/features/diagram-drawer/types'

const Text = ({ parent }: { parent: ItemType | TextType }) => {
    const textRef = useRef<Konva.Text>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [canEdit, setCanEdit] = useState<boolean>(false)
    const [editedText, setEditedText] = useState<string>('')

    const textProxy = diagramHistory.value.texts.find(
        (text) => text.id === parent.id,
    )
    if (!textProxy) return null
    const anchoredItem =
        textProxy.anchor?.type === 'item'
            ? diagramHistory.value.items.find(
                  (i) => i.id === textProxy.anchor.itemId,
              )
            : null

    const x = anchoredItem
        ? anchoredItem.x + anchoredItem.width / 2
        : textProxy.position.x

    const y = anchoredItem
        ? anchoredItem.y + textProxy.anchor.offset.y
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

export default Text
