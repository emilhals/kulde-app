import { useRef, useState } from 'react'

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
    (text) =>
      text.id === (parent.type === 'texts' ? parent.id : parent.text.id),
  )
  if (!textProxy) return null

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
        draggable
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDblClick={handleDoubleClick}
        fontSize={16}
        fontFamily={'Inter'}
        text={textProxy?.content}
        x={textProxy?.position.x}
        y={textProxy?.position.y}
        id={parent.id}
        ref={textRef}
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
