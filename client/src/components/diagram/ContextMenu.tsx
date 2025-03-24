import {
  ContextMenu as CM,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

import { Trash2, Lock, LockOpen, Copy, ChevronLeft } from 'lucide-react'

import { useState } from 'react'
import { Html } from 'react-konva-utils'

import { store } from '@/store'
import { useDeleteFromStore } from '@/hooks/useDeleteFromStore'
import { useAddToStore } from '@/hooks/useAddToStore'

import { ItemPreview } from '@/common/types'

import { Group } from "react-konva"

export const ContextMenu = ({ children }: { children: React.ReactElement }) => {

  const item = store.items.find((item) => item.id === children.props.id)
  if (!item) return

  const [locked, setLocked] = useState<boolean>(item.locked)

  item.locked = locked

  const duplicateItem = () => {
    const duplicatedItem: ItemPreview = {
      ...item,
      x: item.x,
      y: item.y - item.height * 1.5
    }
    useAddToStore(duplicatedItem)
  }

  return (
    <CM>
      <ContextMenuTrigger>
        <Group>
          {children}
        </Group>
      </ContextMenuTrigger>
      <Html>
        <ContextMenuContent className="dark:bg-dark-panel dark:border-dark-border fixed flex justify-center items-center gap-4 px-3 w-fit mx-auto border rounded-lg"
          style={{ left: `${item.x - item.width / 2}px`, top: `${item.y + item.height / 2.5}px` }}
        >
          <ContextMenuItem className='dark:hover:text-dark-accent'>
            <ChevronLeft size={15} />
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
    </CM >

  )

}
