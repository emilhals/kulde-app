import { COMPONENTS } from '@/features/diagram-drawer/constants/components'
import { ComponentItem } from '@/features/diagram-drawer/ui/ComponentItem'
import { ScrollArea } from '@/shared/ui/scroll-area'

const ComponentPanel = () => {
  return (
    <>
      <div
        id="component-panel"
        className="top-0 left-0 z-50 w-48 h-full bg-white rounded-lg border border-gray-300 shrink-0"
      >
        <ScrollArea className="w-full h-full">
          <div className="grid grid-cols-2 gap-2 py-2 px-2">
            {COMPONENTS.map((c) => (
              <ComponentItem key={c.component} item={c} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}

export default ComponentPanel
