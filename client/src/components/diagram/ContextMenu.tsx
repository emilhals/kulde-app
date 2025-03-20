import {
  ContextMenu as CM,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { Trash2, Lock, LockOpen, Copy, ChevronLeft } from 'lucide-react'

import { useState } from 'react'
import { Html } from 'react-konva-utils'

import { useDeleteFromStore } from '@/hooks/useDeleteFromStore'
import { store } from '@/store'

import { Group } from "react-konva"

export const ContextMenu = ({ children }: { children: React.ReactElement }) => {

  const item = store.items.find((item) => item.id === children.props.id)
  if (!item) return

  const [locked, setLocked] = useState<boolean>(item.locked)

  item.locked = locked

  return (
    <CM>
      <ContextMenuTrigger>
        <Group>
          {children}
        </Group>
      </ContextMenuTrigger>
      <Html>
        <ContextMenuContent className="fixed flex justify-center items-center gap-4 px-3 w-fit mx-auto border rounded-lg"
          style={{ left: `${item.x - item.width / 2}px`, top: `${item.y + item.height / 1.5}px` }}
        >
          <ContextMenuItem>
            <ChevronLeft size={15} />
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy size={15} />
          </ContextMenuItem>
          <ContextMenuItem onClick={() => { setLocked(!locked) }}>
            {locked && (
              <LockOpen size={15} />
            )}
            {!locked && (
              <Lock size={15} />
            )}
          </ContextMenuItem>

          <ContextMenuItem onClick={() => { useDeleteFromStore(item.id) }}>
            <Trash2 size={15} />
          </ContextMenuItem>
        </ContextMenuContent>
      </Html>
    </CM >

  )

}
