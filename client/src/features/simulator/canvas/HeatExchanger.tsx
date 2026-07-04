import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Circle, Group, Line, Rect, Text } from 'react-konva'
import { Condensator, Evaporator, Point } from '../types'

type HeatExchangerProps = {
  label: string
  data: Condensator | Evaporator
  position: Point
  scale?: number
}

export const HeatExchanger = ({
  label,
  data,
  position,
  scale = 1,
}: HeatExchangerProps) => {
  const [fanRotation, setFanRotation] = useState(0)
  const [_, setAirflow] = useState(0)

  const { t } = useTranslation('translation', { keyPrefix: 'symbols' })

  const translatedLabel = t(label)

  const bW = 250 * scale
  const bH = 180 * scale

  const r = 65 * scale

  useEffect(() => {
    const interval = setInterval(() => {
      setFanRotation((prev) => (prev + data.fan_speed) % 360)
      setAirflow((prev) => (prev + 2) % 100)
    }, 50)
    return () => clearInterval(interval)
  }, [data.fan_speed])

  return (
    <Group x={position.x} y={position.y}>
      {/* Body */}
      <Rect
        width={bW}
        height={bH}
        fill="#D5D5D5"
        stroke="black"
        strokeWidth={2}
      />

      {label && (
        <Text
          text={translatedLabel}
          width={bW}
          height={bH}
          y={-20}
          fontStyle="bold"
          align="center"
        />
      )}

      {/* Fan circle */}
      <Circle
        x={bW / 2}
        y={bH / 2}
        radius={r}
        fill="#ECEFF1"
        stroke="#37474F"
        strokeWidth={4}
      />

      {/* Fans */}
      <Group x={125} y={90} rotation={fanRotation}>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <Group key={i} rotation={angle}>
            <Line
              points={[0, 0, 0, -50]}
              stroke="#263238"
              strokeWidth={7}
              lineCap="round"
            />
            <Line
              points={[0, -50, -8, -45]}
              stroke="#263238"
              strokeWidth={6}
              lineCap="round"
              lineJoin="round"
            />
          </Group>
        ))}

        {/* Fan center */}
        <Circle radius={12} fill="#263238" stroke="#455A64" strokeWidth={2} />
      </Group>
    </Group>
  )
}
