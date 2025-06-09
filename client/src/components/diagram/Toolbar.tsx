import { useState } from 'react'
import Konva from 'konva'

import { Maximize, Minimize, Plus, Minus } from 'lucide-react'

const Toolbar = ({ stage }: { stage: React.RefObject<Konva.Stage> }) => {
  const [zoomPercentage, setZoomPercentage] = useState<number>(100)
  const [isFullscreen, setFullscreen] = useState<boolean>(false)

  const handleMinMaximize = (maximize: boolean) => {
    const zoom = 0.1

    if (maximize) {
      stage.current?.scale({
        x: stage.current.scaleX() + zoom,
        y: stage.current.scaleY() + zoom
      })

      setZoomPercentage(zoomPercentage + 5)

    } else {
      stage.current?.scale({
        x: stage.current.scaleX() - zoom,
        y: stage.current.scaleY() - zoom
      })
      setZoomPercentage(zoomPercentage - 5)
    }
  }

  const resetZoom = () => {
    stage.current?.scale({
      x: 1,
      y: 1
    })
    setZoomPercentage(100)
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
    <div className='absolute top-0 py-24 z-50 right-0 mx-4 mt-4'>
      <div className='flex items-center bg-transparent gap-4 px-3 w-fit'>
        <button className='bg-transparent' onClick={() => { handleMinMaximize(true) }}>
          <Plus size={16} />
        </button>

        <button onClick={resetZoom} className='font-semibold tracking-wide bg-transparent text-xs'>
          {zoomPercentage}%
        </button>

        <button className='bg-transparent' onClick={() => { handleMinMaximize(false) }}>
          <Minus size={16} />
        </button>

        <button className='bg-transparent'>
          {!isFullscreen && (
            <Maximize size={16} onClick={() => { setFullscreen(true) }} />
          )}

          {isFullscreen && (
            <Minimize size={16} onClick={() => { setFullscreen(false) }} />
          )}
        </button>
      </div>
    </div>
  )
}

export default Toolbar
