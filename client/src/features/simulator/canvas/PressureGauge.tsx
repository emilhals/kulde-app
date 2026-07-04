import { getPointBetween } from '@/features/simulator/physics/math'
import { Position } from '@/features/simulator/types'
import Konva from 'konva'
import { useRef } from 'react'
import { Circle, Group, Line, Text } from 'react-konva'

export const PressureGauge = ({
  inlet,
  pressure,
  type = 'LP',
  scale = 1,
}: {
  inlet: Position
  pressure: number
  type?: 'LP' | 'HP'
  scale?: number
}) => {
  const groupRef = useRef<Konva.Group>(null)
  const needleRef = useRef<Konva.Line>(null)

  const r = 30 * scale
  const origin = { x: inlet.x, y: inlet.y - r }

  const pressureStep = type === 'HP' ? 5 : 1
  const maxPressure = type === 'HP' ? 50 : 10
  const startTick = 4
  const pressureAsTick = pressure / pressureStep
  const tickIndex = startTick + pressureAsTick
  const tickCount = maxPressure / pressureStep + 1
  const angle = (360 / 12) * tickIndex
  const rad = (angle / 180) * Math.PI

  const x = origin.x + r * Math.cos(rad)
  const y = origin.y + r * Math.sin(rad)

  /*useEffect(() => {
    const needle = needleRef.current
    if (!needle) return
    needle.to({
      points: [origin.x, origin.y, x, y], // Ending points

      duration: 1,
      easing: Konva.Easings.EaseInOut,
    })
  }, [pressure])*/

  const drawNeedle = () => {
    return (
      <Group>
        <Line
          ref={needleRef}
          points={[origin.x, origin.y, x, y]}
          stroke="black"
          strokeWidth={1}
          listening={false}
        />
        <Circle x={origin.x} y={origin.y} radius={1} fill="black" />
      </Group>
    )
  }

  const drawTicks = () => {
    const ticks = []

    for (let i = 0; i < tickCount; i++) {
      const tickIndex = startTick + i

      const angle = (360 / 12) * tickIndex
      const rad = (angle / 180) * Math.PI

      const x = origin.x + r * Math.cos(rad)
      const y = origin.y + r * Math.sin(rad)

      const midPoint = getPointBetween(origin, { x: x, y: y }, 0.75)

      ticks.push(
        <Line
          key={`tick-${type}-${i}`}
          stroke="black"
          strokeWidth={2}
          points={[midPoint.x, midPoint.y, x, y]}
          listening={false}
        />,
      )

      if (i % 2 === 0) {
        const label = i * pressureStep
        const text = label.toString()

        const labelRadius = r * 0.55
        const fontSize = 10 * scale
        const approxTextWidth = text.length * fontSize * 0.55

        const labelX = origin.x + labelRadius * Math.cos(rad)
        const labelY = origin.y + labelRadius * Math.sin(rad)

        ticks.push(
          <Text
            key={`text-${i}`}
            text={text}
            fontSize={fontSize}
            fontStyle="bold"
            x={labelX}
            y={labelY}
            offsetX={approxTextWidth / 2}
            offsetY={fontSize / 2}
            fill="black"
            listening={false}
          />,
        )
      }
    }

    return ticks
  }

  return (
    <Group ref={groupRef}>
      <Circle
        x={inlet.x}
        y={inlet.y - r}
        strokeWidth={3}
        stroke="black"
        fill="white"
        radius={r}
        listening={false}
      />

      <Text text="bar" x={inlet.x - 5} y={inlet.y - 12} fontSize={8} />

      {drawNeedle()}
      {drawTicks()}

      <Line
        strokeWidth={8}
        stroke="#B87333"
        points={[inlet.x, inlet.y, inlet.x, inlet.y + 40]}
      />
      <Line
        strokeWidth={10}
        stroke="black"
        points={[inlet.x, inlet.y, inlet.x, inlet.y + 5]}
      />
    </Group>
  )
}
