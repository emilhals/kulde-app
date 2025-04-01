import { useRef, useState } from 'react'

import Konva from 'konva'
import { Group, Text as KonvaText } from 'react-konva'
import { Html } from 'react-konva-utils'

import { store } from '@/store'

import { ItemType, PointType, TextType } from '@/common/types'

export const Text = ({ parent, standalone }: { parent: ItemType | TextType, standalone: boolean }) => {
  if (!parent) return

  const textRef = useRef<Konva.Text>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [canEdit, setCanEdit] = useState<boolean>(false)
  const [editedText, setEditedText] = useState<string>('')

  const [position, setPosition] = useState<PointType>({
    x: 0,
    y: 0
  })


  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
  }

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setPosition({
      x: Math.round(e.target.x() / 16) * 16 - (parent.x),
      y: Math.round(e.target.y() / 16) * 16 - parent.y
    })
  }

  const handleDoubleClick = () => {
    setCanEdit(!canEdit)
    textRef.current?.visible(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let key = e.key

    let textState = store.items.find((item) => item.id === parent.id)?.text
    if (!textState) return

    if (key === 'Enter') {
      console.log('hei')
      setCanEdit(false)
      textRef.current?.visible(true)
      textState.text = editedText
    }
    if (key === 'Escape') {
      setCanEdit(false)
      textRef.current?.visible(true)
    }
  }

  return (
    <Group>
      {standalone && (
        <>
          <KonvaText
            ref={textRef}
            id={parent.id}
            draggable
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDblClick={handleDoubleClick}
            fontSize={16}
            textDecoration={parent.underline ? 'underline' : ''}
            fontStyle={parent.bold ? 'bold' : parent.italic ? 'italic' : ''}
            fontFamily={'Inter'}
            text={parent.text.text}
            x={parent.x + position.x}
            y={parent.y + position.y}
            name="object"
          />
        </>
      )}

      {!standalone && (
        <KonvaText
          ref={textRef}
          id={parent.id}
          draggable
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onDblClick={handleDoubleClick}
          fontSize={16}
          fontFamily={'Inter'}
          text={parent.text.text}
          x={parent.x + position.x}
          y={parent.y + position.y}
          name="object"
        />
      )}


      {canEdit && (
        <Html>
          <input
            ref={inputRef}
            defaultValue={parent.text.text}
            onChange={(e) => { setEditedText(e.target.value) }}
            onKeyDown={handleKeyDown}
            className='absolute border-0'
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
              color: 'color'
            }}
          />
        </Html>
      )}
    </Group>
  )
}
