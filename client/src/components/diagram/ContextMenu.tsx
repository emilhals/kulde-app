import {
  ContextMenu as CM,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { useState } from 'react'
import { Html } from 'react-konva-utils'

import { useDeleteFromStore } from '@/hooks/useDeleteFromStore'
import { store } from '@/store'

export const ContextMenu = ({ children }: { children: React.ReactElement }) => {

  const item = store.items.find((item) => item.id === children.props.id)
  if (!item) return

  const [locked, setLocked] = useState<boolean>(item.locked)

  item.locked = locked

  return (
    <CM>
      <ContextMenuTrigger
        className="position flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        {children}
      </ContextMenuTrigger>
      <Html>
        <ContextMenuContent className="w-64 absolute"
          style={{ left: `${item.x + 50}px`, top: `${item.y}px` }}
        >
          <ContextMenuItem inset>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuCheckboxItem checked={locked} onCheckedChange={setLocked}>
            Lock
            <ContextMenuShortcut>⌘L</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>
                Save Page As...
                <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>Create Shortcut...</ContextMenuItem>
              <ContextMenuItem>Name Window...</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Developer Tools</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />

          <ContextMenuItem inset onClick={() => { useDeleteFromStore(item.id) }}>
            Delete
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </Html>
    </CM>

  )

}
