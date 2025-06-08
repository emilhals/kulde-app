import {
  ContextMenu as CM,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

import { Trash2, Lock, LockOpen, Copy, Type } from 'lucide-react'

import React, { useState, useRef } from 'react'
import { Html } from 'react-konva-utils'

import { store } from '@/store'
import { useDeleteFromStore } from '@/hooks/useDeleteFromStore'
import { useAddToStore } from '@/hooks/useAddToStore'

import { ItemPreview, TextPreview } from '@/common/types'

import { Group } from 'react-konva'

export const ContextMenu = ({ children }: { children: React.ReactElement }) => {

  const item = store.items.find((item) => item.id === children.props.id)
  if (!item) return

  const [locked, setLocked] = useState<boolean>(item.locked)
  const [showInput, setShowInput] = useState<boolean>(false)

  const textInput = useRef<HTMLInputElement>(null)

  item.locked = locked

  const duplicateItem = () => {
    const duplicatedItem: ItemPreview = {
      ...item,
      x: item.x,
      y: item.y - item.height * 1.5
    }
    useAddToStore(duplicatedItem)
  }

  const addText = (content: string) => {
    const newText: TextPreview = {
      type: "texts",
      x: 0,
      y: 0,
      content: content,
      size: 16,
    }

    const textResult = useAddToStore(newText)
    if (!textResult) return

    /* update the item store */
    item.text = textResult
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!textInput.current) return
      addText(textInput.current.value)
      setShowInput(false)
    }

    if (e.key === 'Escape') {
      setShowInput(false)
    }
  }

  return (
    <CM>
      <ContextMenuTrigger>
        <Group>
          {children}
        </Group>
      </ContextMenuTrigger>

      {showInput && (
        <Html>
          <input ref={textInput} type="text" placeholder="Label"
            onKeyDown={handleKeyDown}
            className="rounded-sm border fixed flex justify-center items-center gap-4 px-3 w-fit mx-auto"
            style={{ left: `${item.x - item.width / 2}px`, top: `${item.y - item.height * .5}px` }}
          ></input>
        </Html>
      )}

      <Html>
        <ContextMenuContent className="dark:bg-dark-panel dark:border-dark-border fixed flex justify-center items-center gap-4 px-3 w-fit mx-auto border rounded-lg"
          style={{ left: `${item.x - item.width / 2}px`, top: `${item.y + item.height / 4}px` }}
        >
          <ContextMenuItem onClick={() => setShowInput(true)} className='dark:hover:text-dark-accent'>
            <Type size={15} />
          </ContextMenuItem>

          <ContextMenuItem onClick={duplicateItem} className='dark:hover:text-dark-accent'>
            <Copy size={15} />
          </ContextMenuItem>

          <ContextMenuItem className='dark:hover:text-dark-accent' onClick={() => { setLocked(!locked) }}>
            {locked && (
              <LockOpen size={15} />
            )}
            {!locked && (
              <Lock size={15} />
            )}
          </ContextMenuItem>

          <ContextMenuItem className='dark:hover:text-dark-accent' onClick={() => { useDeleteFromStore(item.id) }}>
            <Trash2 size={15} />
          </ContextMenuItem>

        </ContextMenuContent>
      </Html>
    </CM>
  )
}
