import Konva from 'konva'

import { useState } from 'react'

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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { TextPreview } from '@/features/diagram-drawer/types'

import { addToStore, clearStore } from '@/features/diagram-drawer/store'
import { text } from 'stream/consumers'

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
    position: { x: 0, y: 0 },
    size: 16,
    attributes: [],
  })

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
    <div className="absolute z-50 flex md:top-8 sm:top-24 justify-center items-center w-full">
      <div className="flex flex-row w-fit bg-white shadow-md rounded-lg">
        <div className="flex border-r-2">
          <button
            className={
              'px-3 py-3 border-l rounded-tl-lg rounded-bl-lg hover-bg-gray-100'
            }
          >
            <ArrowLeft className="text-gray-400" size={19} />
          </button>

          <button className={'px-3 py-3 hover-bg-gray-100'}>
            <ArrowRight className="text-gray-400" size={19} />
          </button>
        </div>

        <button className={'py-3 px-3 hover:bg-gray-100'}>
          <Scissors size={19} />
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button className={'py-3 px-3 hover:bg-gray-100'}>
              <Type size={19} />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="">
              <div className="flex flex-col">
                <input
                  id="textInput"
                  type="text"
                  onChange={(e) =>
                    setTextPreview({ ...textPreview, content: e.target.value })
                  }
                  placeholder="Enter text"
                  className="block py-2 px-2 bg-gray-30 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 rounded-sm shadow-inner shadow-gray-100 focus:outline-1 focus:outline-skyblue"
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
                    <Bold size={12} className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="strikethrough"
                    aria-label="Toggle strikethrough"
                  >
                    <Underline className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
                <button
                  onClick={handleAddText}
                  className="bg-black text-gray-100 hover:bg-gray-800 px-3 py-3 mx-auto rounded-lg w-2/3 tracking-wide font-semibold justify-center items-center shadow-sm border-2 border-gray-200"
                >
                  Add Text
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <button
          onClick={() => clearStore()}
          className={'py-3 px-3 hover:bg-gray-100'}
        >
          <Trash2 size={19} />
        </button>

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
