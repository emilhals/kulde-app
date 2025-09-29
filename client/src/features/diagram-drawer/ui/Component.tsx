import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { ComponentType } from '@/features/diagram-drawer/types'

import { uiState } from '@/features/diagram-drawer/store'

const Component = ({ component }: { component: ComponentType }) => {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="border-r px-4">
        <Tooltip>
          <TooltipTrigger>
            <p
              draggable
              onDragStart={() => {
                uiState.dragged = component
              }}
            >
              {component.label}
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{component.label}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export default Component
