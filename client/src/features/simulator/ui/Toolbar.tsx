import { SimulationSpeed, SimulationStatus } from '@/features/simulator/types'
import { Button } from '@/shared/ui/button'
import { ButtonGroup } from '@/shared/ui/button-group'

type ToolbarProps = {
  status: SimulationStatus
  speed: SimulationSpeed
  onSpeedChange: (speed: SimulationSpeed) => void
  onStart: () => void
  onStop: () => void
  onRestart: () => void
}

export const Toolbar = ({
  status,
  speed,
  onSpeedChange,
  onStart,
  onStop,
  onRestart,
}: ToolbarProps) => {
  return (
    <div className="">
      <ButtonGroup>
        {status == 'running' ? (
          <Button variant="outline" onClick={onStop}>
            Stop
          </Button>
        ) : (
          <Button variant="outline" onClick={onStart}>
            Start
          </Button>
        )}
        <Button
          disabled={status === 'restarting'}
          variant="outline"
          onClick={onRestart}
        >
          Restart
        </Button>
      </ButtonGroup>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">Speed</span>

        <ButtonGroup>
          <Button
            variant={speed === 'normal' ? 'default' : 'outline'}
            onClick={() => onSpeedChange('normal')}
          >
            1×
          </Button>

          <Button
            variant={speed === 'fast' ? 'default' : 'outline'}
            onClick={() => onSpeedChange('fast')}
          >
            3×
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
