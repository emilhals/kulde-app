import { Button } from '@/features/shared/ui/button'
import { useTranslation } from 'react-i18next'
import { useSnapshot } from 'valtio'
import { simulationState } from '../stores/simulation'
import { stopSimulationState } from '../stores/simulation.actions'

type PlaybackButtonProps = { onStart: () => void; onStop: () => void }

export const PlaybackButton = ({ onStart, onStop }: PlaybackButtonProps) => {
  const { t } = useTranslation('simulator')

  const controls = useSnapshot(simulationState.controls)
  const isRunning = controls.status === 'running'

  const handleClick = () => {
    if (isRunning) {
      stopSimulationState()
      onStop()
      return
    } else {
      onStart()
    }
  }

  return (
    <Button variant="outline" onClick={handleClick}>
      {t(isRunning ? 'stop-simulation' : 'start-simulation')}
    </Button>
  )
}
