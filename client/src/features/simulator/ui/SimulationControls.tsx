import { SimulationStatus } from '@/features/simulator/types'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shared/ui/tooltip'
import { Play, RotateCw, Square } from 'lucide-react'

type Props = {
	status: SimulationStatus
	onPlay: () => void
	onStop: () => void
	onRestart: () => void
}
export const SimulationControls = ({
	status,
	onPlay,
	onStop,
	onRestart,
}: Props) => {
	return (
		<div className="flex absolute left-6 top-8 z-50 flex-row justify-center items-center w-20 h-8 bg-white rounded-lg border border-gray-300 shrink-0">
			<div className="flex gap-x-4 justify-center items-center">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							{status == 'RUNNING' && (
								<button className="bg-transparent" onClick={onStop}>
									<Square size={16} />
								</button>
							)}
						</TooltipTrigger>
						<TooltipContent>
							<p>Stop simulation</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							{status !== 'RUNNING' && (
								<button className="bg-transparent" onClick={onPlay}>
									<Play size={16} />
								</button>
							)}
						</TooltipTrigger>
						<TooltipContent>
							<p>Start simulation</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<button className="bg-transparent" onClick={onRestart}>
								<RotateCw size={16} />
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Restart simulation</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	)
}
