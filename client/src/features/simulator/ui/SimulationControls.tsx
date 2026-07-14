import { SimulationSpeed, SimulationStatus } from '@/features/simulator/types'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip'
import { Play, RotateCcw, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type SimulationControlsProps = {
  simulationStatus: SimulationStatus
  speed: SimulationSpeed
  onSpeedChange: (speed: SimulationSpeed) => void
  onStart: () => void
  onStop: () => void
  onRestart: () => void
}

const getSpeedNumber = (speed: SimulationSpeed) => {
  switch (speed) {
    case 'slow':
      return 0.5
    case 'normal':
      return 1
    case 'fast':
      return 3
    default:
      return 1
  }
}

export const SimulationControls = ({
  simulationStatus,
  speed,
  onSpeedChange,
  onStart,
  onStop,
  onRestart,
}: SimulationControlsProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'simulator' })

  const speedNumber = getSpeedNumber(speed)
  const isRunning = simulationStatus === 'running'
  return (
    <div className="flex gap-2 items-end">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={isRunning ? onStop : onStart}
              aria-label="Stop simulation"
            >
              {isRunning ? <Square /> : <Play />}
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            {isRunning ? t('stop-simulation') : t('start-simulation')}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                size="icon"
                variant="outline"
                onClick={onRestart}
                aria-label="Restart simulation"
              >
                <RotateCcw />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{t('restart-simulation')}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <DropdownMenu>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline">
                    {speedNumber}x
                  </Button>
                </DropdownMenuTrigger>
              </span>
            </TooltipTrigger>

            <TooltipContent>{t('change-speed')}</TooltipContent>

            <DropdownMenuContent
              className="w-24"
              onCloseAutoFocus={(event) => {
                event.preventDefault()
              }}
            >
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup
                  value={speed}
                  onValueChange={(value) =>
                    onSpeedChange(value as SimulationSpeed)
                  }
                >
                  <DropdownMenuRadioItem value="slow">
                    0.5x
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="normal">
                    1x
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="fast">3x</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
