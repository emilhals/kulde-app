import { RefObject, useEffect, useState } from 'react'

export type Stage = {
  width: number
  height: number
  scale: number

  x: number
  y: number
}

const DESIGN_WIDTH = 900
const DESIGN_HEIGHT = 700

export const useResponsiveStage = (containerRef: RefObject<HTMLDivElement>) => {
  const [stage, setStage] = useState<Stage>({
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    scale: 1,
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const scale = Math.min(
        entries[0].contentRect.width / DESIGN_WIDTH,
        entries[0].contentRect.width / DESIGN_HEIGHT,
      )

      setStage({
        ...stage,
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height,
        scale: scale,
      })
    })

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return stage
}
