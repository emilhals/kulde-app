import { RefObject, useEffect, useState } from 'react'

type Stage = { scale: number; width: number; height: number }

export const useResponsiveStage = (containerRef: RefObject<HTMLDivElement>) => {
  const [stage, setStage] = useState<Stage>()

  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return
      const { clientWidth, clientHeight } = containerRef.current
      setStage({ scale: 1, width: clientWidth, height: clientHeight })
    }

    containerRef.current?.focus()

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [containerRef])

  return stage
}
