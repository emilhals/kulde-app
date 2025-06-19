import { useState } from 'react'

import { Lock, LockOpen, X } from 'lucide-react'

import { state } from '@/stores/settingsStore'
import { store } from '@/store'
import { useSnapshot } from 'valtio'

import { useDeleteFromStore } from '@/hooks/useDeleteFromStore'
import { useAddToStore } from '@/hooks/useAddToStore'

import { ItemPreview, PointType, TextPreview, TextType } from '@/common/types'

export const ContextMenu = ({ position }: { position: PointType }) => {
  if (!position) return

  const item = store.items.find((item) => item.id === store.selected?.id)
  if (!item) return

  const [locked, setLocked] = useState<boolean>(item.locked)
  const [show, setShow] = useState<boolean>(true)

  const snap = useSnapshot(state)

  item.locked = locked

  const duplicateItem = () => {
    const newText: TextPreview = {
      type: 'texts',
      position: { x: item.x, y: item.y },
      content: item.text.content,
      size: 16,
    }

    const addedText = useAddToStore(newText) as TextType
    if (!addedText) return

    const duplicatedItem: ItemPreview = {
      ...item,
      text: addedText,
      x: item.x,
      y: item.y - item.height * 1.5
    }
    useAddToStore(duplicatedItem)
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 10,
        backgroundColor: snap.isDarkMode ? snap.darkBackgroundColor : snap.lightBackgroundColor,
        fontFamily: snap.font
      }
      }
      id='contextmenu'
      className={`
        bg-white shadow-md w-48 h-19 gap-y-4 flex flex-col transition-colors duration-200 justify-center border-1 items-center rounded-bl-lg rounded-br-lg ${show ? '' : 'hidden'}
        dark:border-2
      `}
    >
      <div className='flex py-3'>
        <X
          onClick={() => setShow(false)}
          className='absolute left-3 top-3 hover:cursor-pointer' size={12} />
        <div className='flex flex-col justify-center items-center'>
          <h3
            style={{ color: snap.isDarkMode ? snap.lightAccentColor : snap.darkAccentColor }}
            className='uppercase text-md tracking-wide'>Info</h3>
          <p className='text-gray-600 text-sm'>{item.component}</p>
        </div>
      </div>

      <div className='w-fit flex flex-col gap-y-1'>
        <label className='text-sm'>Label</label>
        <input
          type='text'
          className='border-gray-500 border-b-2 bg-gray-50 w-32 focus:outline-none dark:text-black'
          value={item.text.content}
          style={{
            borderColor: snap.isDarkMode ? snap.darkAccentColor : snap.lightAccentColor,
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            item.text.content = e.target.value
          }} />
      </div>

      <div className='mt-4'>
        <button className='bg-transparent' onClick={() => setLocked(false)}>
          {locked && (
            <Lock size={18} />
          )}
        </button>
        <button className='bg-transparent' onClick={() => setLocked(true)}>
          {!locked && (
            <LockOpen size={18} />
          )}
        </button>
      </div>

      <div className='flex flex-row gap-3 px-4 py-3'>
        <button
          onClick={duplicateItem}
          className='border-2 py-2 px-2 text-sm hover:bg-gray-50 border-1 border-gray-100 rounded-sm dark:bg-gray-900 dark:hover:bg-gray-800'>Duplicate</button>
        <button
          onClick={() => useDeleteFromStore(item.id)}
          className='bg-rose-500 px-2 text-white hover:bg-rose-600 text-sm rounded-sm inset-shadow-sm inset-shadow-white/50'>Remove</button>
      </div>
    </div >
  )
}

export default ContextMenu
