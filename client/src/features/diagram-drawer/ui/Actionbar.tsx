import { useState } from 'react'

import Konva from 'konva'

import {
  Scissors,
  ArrowLeft,
  ArrowRight,
  Type,
  Trash2,
  Download,
  Bold,
  Italic,
  Underline,
} from 'lucide-react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { useSnapshot } from 'valtio'
import {
  addToStore,
  clearStore,
  diagramHistory,
  uiState,
} from '@/features/diagram-drawer/store'

import { TextPreview } from '@/features/diagram-drawer/types'

const downloadURI = (uri: string, name: string) => {
  const link = document.createElement('a')
  link.download = name
  link.href = uri

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const Actionbar = ({ stage }: { stage: React.RefObject<Konva.Stage> }) => {
  const [textPreview, setTextPreview] = useState<TextPreview>({
    type: 'texts',
    content: '',
    position: { x: 10, y: 10 },
    size: 16,
    attributes: [],
  })

  const diagramSnap = useSnapshot(diagramHistory)
  const uiSnap = useSnapshot(uiState)

  const handleExport = () => {
    if (!stage.current) return null

    const uri = stage.current.toDataURL()
    downloadURI(uri, 'stage.png')
  }

  const handleAddText = () => {
    if (!textPreview.content) return null

    addToStore(textPreview)

    setTextPreview({
      type: 'texts',
      content: '',
      position: { x: 0, y: 0 },
      size: 16,
      attributes: [],
    })
  }

  return (
    <div className="flex fixed right-1/2 left-1/2 z-50 justify-center items-center sm:top-24 md:top-28">
      <div className="flex flex-row bg-white rounded-lg shadow-md w-fit">
        <div className="flex border-r-2">
          <button
            className={
              'px-3 py-3 border-l rounded-tl-lg rounded-bl-lg hover-bg-gray-100'
            }
            disabled={!diagramSnap.isUndoEnabled}
            onClick={() => diagramSnap.undo()}
          >
            <ArrowLeft
              className={`${diagramSnap.isUndoEnabled ? 'text-gray-900' : 'text-gray-400'}`}
              size={19}
            />
          </button>

          <button
            className={'px-3 py-3 hover-bg-gray-100'}
            disabled={!diagramSnap.isRedoEnabled}
            onClick={() => diagramSnap.redo()}
          >
            <ArrowRight
              className={`${diagramSnap.isRedoEnabled ? 'text-gray-900' : 'text-gray-400'}`}
              size={19}
            />
          </button>
        </div>

        <button
          className={`py-3 px-3 hover:bg-gray-100 ${uiSnap.action == 'delete' ? 'bg-gray-100' : 'bg-white'}`}
          onClick={() => {
            uiState.action = 'delete'
          }}
        >
          <Scissors size={19} />
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`py-3 px-3 hover:bg-gray-100 ${uiSnap.action == 'write' ? 'bg-gray-100' : 'bg-white'}`}
            >
              <Type size={19} />
            </button>
          </PopoverTrigger>
          <PopoverContent
            onOpenAutoFocus={() => (uiState.action = 'write')}
            onCloseAutoFocus={() => (uiState.action = null)}
          >
            <div className="">
              <div className="flex flex-col">
                <input
                  id="textInput"
                  type="text"
                  onChange={(e) =>
                    setTextPreview({ ...textPreview, content: e.target.value })
                  }
                  placeholder="Enter text"
                  className="block py-2 px-2 text-base text-gray-900 rounded-sm shadow-inner bg-gray-30 outline outline-1 outline-offset-1 outline-gray-300 shadow-gray-100 focus:outline-1 focus:outline-skyblue"
                />
                <ToggleGroup
                  variant="outline"
                  type="multiple"
                  className="flex py-4 mx-auto"
                  onValueChange={(value) => {
                    setTextPreview({ ...textPreview, attributes: value })
                  }}
                >
                  <ToggleGroupItem value="bold" aria-label="Toggle bold">
                    <Bold size={12} className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Toggle italic">
                    <Italic className="w-4 h-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="underline"
                    aria-label="Toggle underline"
                  >
                    <Underline className="w-4 h-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
                <button
                  onClick={handleAddText}
                  className="justify-center items-center py-3 px-3 mx-auto w-2/3 font-semibold tracking-wide text-gray-100 bg-black rounded-lg border-2 border-gray-200 shadow-sm hover:bg-gray-800"
                >
                  Add Text
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Dialog>
          <DialogTrigger>
            <div className="flex justify-center py-3 px-3 hover:bg-gray-100 hover:cursor-pointer">
              <Trash2 size={19} />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <button
                onClick={clearStore}
                className="justify-center items-center py-3 px-3 mx-auto w-2/3 font-semibold tracking-wide text-gray-100 bg-black rounded-lg border-2 border-gray-200 shadow-sm hover:bg-gray-800"
              >
                Clear Canvas
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        <button
          className={
            'py-3 px-3 border-r-2 rounded-tr-lg rounded-br-lg hover:bg-gray-100'
          }
        >
          <Download onClick={handleExport} size={19} />
        </button>
      </div>
    </div>
  )
}

export default Actionbar
