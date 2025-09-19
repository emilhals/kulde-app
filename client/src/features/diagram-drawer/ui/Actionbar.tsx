import Konva from 'konva'

import {
  Scissors,
  ArrowLeft,
  ArrowRight,
  Type,
  Trash2,
  Download,
} from 'lucide-react'

import { clearStore } from '@/features/diagram-drawer/store'

const downloadURI = (uri: string, name: string) => {
  const link = document.createElement('a')
  link.download = name
  link.href = uri

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const Actionbar = ({ stage }: { stage: React.RefObject<Konva.Stage> }) => {
  const handleExport = () => {
    if (!stage.current) return null

    const uri = stage.current.toDataURL()
    downloadURI(uri, 'stage.png')
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

        <button className={'py-3 px-3 hover:bg-gray-100'}>
          <Type size={19} />
        </button>

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
