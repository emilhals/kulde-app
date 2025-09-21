import { useState } from 'react'

import { Lock, LockOpen, Trash2, Copy } from 'lucide-react'

import {
  removeFromStore,
  addToStore,
  diagramHistory,
  uiState,
} from '@/features/diagram-drawer/store'
import { useSnapshot } from 'valtio'

import {
  ItemPreview,
  ItemType,
  PointType,
  TextPreview,
  TextType,
} from '@/features/diagram-drawer/types'

export const ContextMenu = ({ position }: { position: PointType }) => {
  const diagramSnap = useSnapshot(diagramHistory)

  const [show, setShow] = useState<boolean>(true)

  const item = diagramSnap.value.items.find(
    (item) => item.id === uiState.selected?.id,
  )
  if (!item) return

  const itemProxy = diagramHistory.value.items.find(
    (item) => item.id === uiState.selected?.id,
  )
  if (!itemProxy) return

  const handleDuplicate = () => {
    const newText: TextPreview = {
      type: 'texts',
      position: { x: item.x, y: item.y },
      content: item.text.content,
      size: 16,
    }

    const addedText = addToStore(newText)

    const duplicatedItem: ItemPreview = {
      ...item,
      text: addedText,
      x: item.x,
      y: item.y - item.height * 1.5,
    }

    addToStore(duplicatedItem)
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 10,
        backgroundColor: 'white',
      }}
      id="contextmenu"
      className={`
        border-2 rounded-md  
        ${show ? '' : 'hidden'}
      `}
    >
      <div className="relative inline-block text-sm leading-5 tracking-tight">
        <div className="flex flex-row px-2 items-center justify-center py-2">
          <input
            className="block py-2 px-2 bg-gray-30 text-sm text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 rounded-sm shadow-inner shadow-gray-100 focus:outline-1 focus:outline-skyblue"
            placeholder="Enter label"
            value={itemProxy.text.content}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              itemProxy.text.content = e.target.value
            }}
            type="text"
          />
        </div>

        <div className="flex flex-col border-t-2 py-2">
          <button
            onClick={handleDuplicate}
            className="group flex py-2 items-center justify-center hover:bg-gray-50"
          >
            <Copy className="absolute left-3" size={12} />
            Duplicate object
          </button>

          <button
            onClick={() => (itemProxy.locked = !itemProxy.locked)}
            className="group py-2 flex items-center justify-center hover:bg-gray-50"
          >
            {itemProxy.locked ? 'Unlock object' : 'Lock object'}
            {itemProxy.locked ? (
              <LockOpen className="absolute left-3" size={13} />
            ) : (
              <Lock className="absolute left-3" size={13} />
            )}
          </button>
        </div>

        <div className="border-t-2 py-2">
          <button
            onClick={() => removeFromStore(itemProxy)}
            className="group flex justify-center items-center text-red-600 w-full px-4 py-2 hover:bg-gray-50"
          >
            <Trash2 className="absolute left-3" size={13} />
            Delete object
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContextMenu
