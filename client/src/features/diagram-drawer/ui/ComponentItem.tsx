import { SYMBOL_MAP } from '@/features/diagram-drawer/constants/SymbolMap'
import { uiState } from '@/features/diagram-drawer/store/models'
import type { ItemPreview } from '@/features/diagram-drawer/types'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/shared/ui/tooltip'
import { useTranslation } from 'react-i18next'
import { Group, Layer, Stage } from 'react-konva'

export const ComponentItem = ({ item }: { item: ItemPreview }) => {
    const { t } = useTranslation()

    if (!item) return null

    const previewItem: ItemPreview = {
        label: item.label,
        component: item.component,
        width: item.width,
        height: item.height,
        anchors: item.anchors,
    }
    const Symbol = SYMBOL_MAP[previewItem.component]

    const scale = Math.min(60 / previewItem.width, 60 / previewItem.height)

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger>
                    <div
                        draggable
                        onDragStart={() => {
                            uiState.dragged = previewItem
                        }}
                        aria-label={previewItem.label}
                        className="hover:scale-110 ease-in-out transition"
                    >
                        <Stage width={80} height={80} listening={false}>
                            <Layer>
                                <Group
                                    x={40 - (previewItem.width * scale) / 2}
                                    y={40 - (previewItem.height * scale) / 2}
                                    scaleX={scale}
                                    scaleY={scale}
                                >
                                    {Symbol && <Symbol item={previewItem} />}
                                </Group>
                            </Layer>
                        </Stage>
                    </div>
                </TooltipTrigger>
                <TooltipContent aria-label={previewItem.label}>
                    <p>{t(`symbols.${previewItem.label}`)}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
