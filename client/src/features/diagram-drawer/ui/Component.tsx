import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { ComponentType, ItemType } from '@/features/diagram-drawer/types'

import { uiState } from '@/features/diagram-drawer/store'

import { Stage, Layer, Group } from 'react-konva'
import { SYMBOL_MAP } from '../canvas/symbols/SymbolMap'

const Component = ({ component }: { component: ComponentType }) => {
    const previewItem: ItemType = {
        id: 'preview',
        type: 'items',
        component: component.value,
        x: 0,
        y: 0,
        width: component.width,
        height: component.height,
        locked: false,
        anchors: {
            position: component.anchors?.position,
        },
    }

    const Symbol = SYMBOL_MAP[component.value as keyof typeof SYMBOL_MAP]

    const scale = Math.min(60 / component.width, 60 / component.height)

    return (
        <TooltipProvider delayDuration={300}>
            <div className="border-r px-4">
                <Tooltip>
                    <TooltipTrigger>
                        <div
                            draggable
                            onDragStart={() => {
                                uiState.dragged = component
                            }}
                        >
                            <Stage width={80} height={80} listening={false}>
                                <Layer>
                                    <Group
                                        x={40 - (component.width * scale) / 2}
                                        y={40 - (component.height * scale) / 2}
                                        scaleX={scale}
                                        scaleY={scale}
                                    >
                                        {Symbol && (
                                            <Symbol item={previewItem} />
                                        )}
                                    </Group>
                                </Layer>
                            </Stage>
                        </div>
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
