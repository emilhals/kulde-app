import { useRef, useState } from 'react'

import Konva from 'konva'
import { Rect, Group, Text as KonvaText } from 'react-konva'
import { Html } from 'react-konva-utils'

import { store } from '@/store'

import { PointType, TextType } from '@/common/types'

/*
 * TODO: lag snap til object for non-standalone text
 * 
 */
export const Text = ({ parent, standalone }: { parent: TextType, standalone: Boolean }) => {
  const textRef = useRef<Konva.Text>(null)
  const shadowRef = useRef<Konva.Rect>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [canEdit, setCanEdit] = useState<boolean>(false)
  const [editedText, setEditedText] = useState<string>('')

  const [position, setPosition] = useState<PointType>({
    x: 0,
    y: 0
  })

  const [shadowPosition, setShadowPosition] = useState<PointType>({
    x: 0,
    y: 0
  })

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    shadowRef.current?.show()

    setShadowPosition({
      x: Math.round(e.target.x() / 16) * 16,
      y: Math.round(e.target.y() / 16) * 16
    })
  }


  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setPosition({
      x: Math.round(e.target.x() / 16) * 16 - (parent.x),
      y: Math.round(e.target.y() / 16) * 16 - parent.y
    })
    shadowRef.current?.hide()
  }

  const handleDoubleClick = () => {
    setCanEdit(!canEdit)
    textRef.current?.visible(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let key = e.key

    let textState = store.texts.find((text) => text.id === parent.id)
    if (!textState) return

    if (key === 'Enter') {
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
      <Rect
        ref={shadowRef}
        fill="blue"
        visible={false}
        opacity={0.4}
        x={shadowPosition.x}
        y={shadowPosition.y}
        height={textRef.current?.textHeight}
        width={textRef.current?.textWidth}
        name="shadow"
      />
      {standalone && (
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
          fontFamily={'Open Sans'}
          text={parent.text}
          x={parent.x + position.x}
          y={parent.y + position.y}
          name="object"
        />
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
          textDecoration={parent.underline ? 'underline' : ''}
          fontStyle={parent.bold ? 'bold' : parent.italic ? 'italic' : ''}
          fontFamily={'Open Sans'}
          text={parent.label}
          x={parent.x + position.x}
          y={parent.y + position.y}
          name="object"
        />
      )}


      {canEdit && (
        <Html>
          <input
            ref={inputRef}
            defaultValue={parent.text}
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
