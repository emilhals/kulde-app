import { diagramHistory } from '@/features/diagram-drawer/store/models'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/shared/ui/tooltip'
import Konva from 'konva'
import { ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useSnapshot } from 'valtio'

export const Toolbar = ({
    stageRef,
}: {
    stageRef: React.RefObject<Konva.Stage>
}) => {
    const diagramSnap = useSnapshot(diagramHistory)

    const [zoomLevel, setZoomLevel] = useState<number>(100)

    const isMac = navigator.userAgent.toLowerCase().includes('mac')
    const modifierKey = isMac ? '⌘' : 'Ctrl'

    const handleMinMaximize = (maximize: boolean) => {
        const zoomAmount = 0.1

        const stage = stageRef.current
        if (!stage) return

        const currentScale = stage.scaleX()

        const newScale = maximize
            ? currentScale + zoomAmount
            : currentScale - zoomAmount

        stage.scale({ x: newScale, y: newScale })

        setZoomLevel(Math.round(newScale * 100))
    }

    const handleResetZoom = () => {
        const stage = stageRef.current
        if (!stage) return

        stage.scale({ x: 1, y: 1 })
        setZoomLevel(100)
    }

    return (
        <div
            id="toolbar"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40"
        >
            <div className="flex items-center gap-3 px-3 py-1.5 bg-white shadow-md rounded-lg border">
                <TooltipProvider delayDuration={300}>
                    <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-40"
                                    disabled={!diagramSnap.isUndoEnabled}
                                    onClick={() => diagramSnap.undo()}
                                >
                                    <ArrowLeft size={16} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent className="flex items-center gap-2">
                                Undo
                                <span className="opacity-60">
                                    {modifierKey} Z
                                </span>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-40"
                                    disabled={!diagramSnap.isRedoEnabled}
                                    onClick={() => diagramSnap.redo()}
                                >
                                    <ArrowRight size={16} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent className="flex items-center gap-2">
                                Redo
                                <span className="opacity-60">
                                    {modifierKey} R
                                </span>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="w-px h-5 bg-gray-200" />

                    <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    className="p-2 rounded-md hover:bg-gray-100"
                                    onClick={() => {
                                        handleMinMaximize(false)
                                    }}
                                >
                                    <Minus size={16} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent className="flex items-center gap-2">
                                Zoom out
                                <span className="opacity-60">
                                    {modifierKey} -
                                </span>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    className="text-sm font-medium w-12 text-center select-none"
                                    onClick={() => {
                                        handleResetZoom()
                                    }}
                                >
                                    {zoomLevel}%
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>Reset zoom</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    className="p-2 rounded-md hover:bg-gray-100"
                                    onClick={() => {
                                        handleMinMaximize(true)
                                    }}
                                >
                                    <Plus size={16} />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent className="inline-flex items-center gap-3 px-3 py-2">
                                <span>Zoom in</span>
                                <span className="opacity-60">
                                    {modifierKey} +
                                </span>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </div>
        </div>
    )
}
