import { Maximize, Minimize, Plus, Minus } from 'lucide-react'

import Konva from 'konva'
import { useState } from 'react'

export const Toolbar = ({ stage }: { stage: React.RefObject<Konva.Stage> }) => {

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

  const navbar = document.getElementById('navbar') as HTMLHeadingElement

  if (isFullscreen) {
    navbar.style.display = 'none'
  } else {
    navbar.style.display = 'block'
  }

  return (
    <div className="absolute z-50 right-0 mx-4 mt-4">
      <div className='flex items-center gap-4 px-3 w-fit'>
        <button onClick={() => { handleMinMaximize(true) }}>
          <Plus size={16} />
        </button>

        <button onClick={resetZoom} className='font-semibold tracking-wide text-xs'>
          {zoomPercentage}%
        </button>

        <button onClick={() => { handleMinMaximize(false) }}>
          <Minus size={16} />
        </button>

        <button>
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
