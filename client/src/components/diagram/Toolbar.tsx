import { useState } from 'react'
import Konva from 'konva'

import { Maximize, Minimize, Plus, Minus } from 'lucide-react'

const Toolbar = ({ stage }: { stage: React.RefObject<Konva.Stage> }) => {
  const [isFullscreen, setFullscreen] = useState<boolean>(false)

  const handleMinMaximize = (maximize: boolean) => {
    const zoom = 0.1

    if (maximize) {
      stage.current?.scale({
        x: stage.current.scaleX() + zoom,
        y: stage.current.scaleY() + zoom
      })
    } else {
      stage.current?.scale({
        x: stage.current.scaleX() - zoom,
        y: stage.current.scaleY() - zoom
      })
    }
  }

  const navbar = document.getElementById('navbar')
  if (!navbar) return

  const componentPanel = document.getElementById('component-panel')
  if (!componentPanel) return

  if (isFullscreen) {
    navbar.style.display = 'none'
    componentPanel.style.display = 'none'
  } else {
    navbar.style.display = 'block'
    componentPanel.style.display = 'block'
  }

  return (
    <div id='toolbar' className='fixed bottom-8 py-32 z-50 right-0 mx-4'>
      <div className='flex flex-col bg-white shadow-md rounded-lg items-center'>
        <button className='py-2 px-2 hover:bg-gray-50 rounded-lg' onClick={() => { handleMinMaximize(true) }}>
          <Plus size={16} />
        </button>

        <button className='py-2 px-2 hover:bg-gray-50' onClick={() => { handleMinMaximize(false) }}>
          <Minus size={16} />
        </button>

        <button className='py-2 px-2 rounded-lg hover:bg-gray-50'>
          {!isFullscreen && (
            <Maximize size={16} onClick={() => { setFullscreen(true) }} />
          )}

          {isFullscreen && (
            <Minimize size={16} onClick={() => { setFullscreen(false) }} />
          )}
        </button>
      </div>
    </div >
  )
}

export default Toolbar
