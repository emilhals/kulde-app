import { useState } from 'react'
import Konva from 'konva'

import { Maximize, Minimize, Plus, Minus } from 'lucide-react'

const Toolbar = ({ stage }: { stage: React.RefObject<Konva.Stage> }) => {
  const [isFullscreen, setFullscreen] = useState<boolean>(false)

  const handleMinMaximize = (maximize: boolean) => {
    const zoomAmount = 0.1

    if (maximize) {
      stage.current?.scale({
        x: stage.current.scaleX() + zoomAmount,
        y: stage.current.scaleY() + zoomAmount,
      })
    } else {
      stage.current?.scale({
        x: stage.current.scaleX() - zoomAmount,
        y: stage.current.scaleY() - zoomAmount,
      })
    }
  }

  const navbar = document.getElementById('navbar')
  if (!navbar) return

  if (isFullscreen) {
    navbar.style.display = 'none'
  } else {
    navbar.style.display = 'block'
  }

  return (
    <div id="toolbar" className="absolute bottom-0 py-48 z-40 right-0 mx-4">
      <div
        className="
        flex flex-col bg-white shadow-md rounded-lg items-center
        dark:bg-darkBackground dark:border-2 
        "
      >
        <button
          className="
          py-2 px-2 hover:bg-gray-50 rounded-lg 
          dark:bg-darkBackground"
          onClick={() => {
            handleMinMaximize(true)
          }}
        >
          <Plus size={16} />
        </button>

        <button
          className="
          py-2 px-2 hover:bg-gray-50
          dark:bg-darkBackground
          "
          onClick={() => {
            handleMinMaximize(false)
          }}
        >
          <Minus size={16} />
        </button>

        <button
          className="
          py-2 px-2 rounded-lg hover:bg-gray-50
          dark:bg-darkBackground
          "
        >
          {!isFullscreen && (
            <Maximize
              size={16}
              onClick={() => {
                setFullscreen(true)
              }}
            />
          )}

          {isFullscreen && (
            <Minimize
              size={16}
              onClick={() => {
                setFullscreen(false)
              }}
            />
          )}
        </button>
      </div>
    </div>
  )
}

export default Toolbar
