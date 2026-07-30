import { SYMBOL_MAP } from '@/features/diagram-drawer/constants/SymbolMap'
import { uiState } from '@/features/diagram-drawer/store/ui-state'
import type { ItemPreview } from '@/features/diagram-drawer/types'
import { useTheme } from '@/features/shared/contexts/theme-provider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/features/shared/ui/tooltip'
import { useTranslation } from 'react-i18next'
import { Group, Layer, Stage } from 'react-konva'
import { CANVAS_COLORS } from '../constants/canvas'

export const ComponentItem = ({ item }: { item: ItemPreview }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'symbols' })
  const { resolvedTheme } = useTheme()

  const previewItem: ItemPreview = {
    label: item.label,
    component: item.component,
    width: item.width,
    height: item.height,
    anchors: item.anchors,
  }
  const Symbol = SYMBOL_MAP[previewItem.component]

  const scale = Math.min(65 / previewItem.width, 65 / previewItem.height)

  const colors = CANVAS_COLORS[resolvedTheme]

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
            className="transition ease-in-out hover:scale-110"
          >
            <Stage width={80} height={80} listening={false}>
              <Layer>
                <Group
                  x={40 - (previewItem.width * scale) / 2}
                  y={40 - (previewItem.height * scale) / 2}
                  scaleX={scale}
                  scaleY={scale}
                >
                  <Symbol
                    strokeColor={colors.foreground}
                    fillColor={colors.background}
                    item={previewItem}
                  />
                </Group>
              </Layer>
            </Stage>
          </div>
        </TooltipTrigger>
        <TooltipContent aria-label={previewItem.label}>
          <p>{t(previewItem.component)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
