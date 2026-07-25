import type { Stage } from '@/shared/hooks/useResponsiveStage'
import Konva from 'konva'
import { RefObject, useEffect } from 'react'
import { GRID_BLOCK_SIZE } from '@/features/diagram-drawer/constants/canvas'

export const useGridLayer = (
  stage: Stage | undefined, // This is only kept to retrigger once canvas is loaded
  gridLayerRef: RefObject<Konva.Layer>,
  showGrid: boolean,
  gridColor: string,
  isPanning: boolean,
) => {
  useEffect(() => {
    const layer = gridLayerRef.current
    if (!layer) return

    layer.destroyChildren()

    const stage = layer.getStage()
    if (!stage) return

    const padding = GRID_BLOCK_SIZE

    const startX =
      Math.floor((-stage.x() - window.innerWidth) / padding) * padding
    const endX =
      Math.floor((-stage.x() + window.innerWidth * 2) / padding) * padding

    const startY =
      Math.floor((-stage.y() - window.innerHeight) / padding) * padding
    const endY =
      Math.floor((-stage.y() + window.innerHeight * 2) / padding) * padding

    if (showGrid) {
      for (let i = startX; i < endX; i++) {
        layer.add(
          new Konva.Line({
            points: [
              Math.round(i * padding) + 0.5,
              startY,
              Math.round(i * padding) + 0.5,
              endY,
            ],
            stroke: gridColor,
            strokeWidth: 1,
          }),
        )
      }
      for (let j = startY; j < endY; j++) {
        layer.add(
          new Konva.Line({
            points: [
              startX,
              Math.round(j * padding),
              endX,
              Math.round(j * padding),
            ],
            stroke: gridColor,
            strokeWidth: 0.5,
          }),
        )
      }
    }
  }, [stage, showGrid, gridColor, isPanning])
}
