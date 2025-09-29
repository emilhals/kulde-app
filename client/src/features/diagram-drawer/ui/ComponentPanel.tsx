import { ArrowDownFromLineIcon, ArrowUpFromLineIcon } from 'lucide-react'

import { COMPONENTS } from '@/features/diagram-drawer/utils/components'
import Component from '@/features/diagram-drawer/ui/Component'

import { useState } from 'react'

const ComponentPanel = () => {
  const [showPanel, setShowPanel] = useState<boolean>(true)

  const togglePanel = () => {
    setShowPanel(!showPanel)
  }

  return (
    <div id="component-panel" className="absolute z-50 bottom-0 w-full">
      <div className="py-4 px-4 bg-transparent hover:cursor-pointer">
        {showPanel && <ArrowDownFromLineIcon size={16} onClick={togglePanel} />}

        {!showPanel && <ArrowUpFromLineIcon size={16} onClick={togglePanel} />}
      </div>
      <div
        className={`bg-white w-full shadow-lg transition-all duration-300 border-t-2 
          dark:bg-darkBackground dark:border-gray-600
          ${showPanel ? 'h-32' : 'h-0 overflow-hidden'}`}
      >
        {showPanel && (
          <ul className="flex h-full flex-row px-2 items-center">
            {COMPONENTS.map((component) => (
              <Component key={component.value} component={component} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ComponentPanel
