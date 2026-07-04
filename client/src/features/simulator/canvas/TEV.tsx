import { Point } from '@/features/simulator/types'
import { Group, Line, Rect, Shape } from 'react-konva'

const VALVE_COLOR = '#E8A020'
const VALVE_DARK = '#C07010'
const BODY_COLOR = '#61583a'
const SPRING_COLOR = '#1a6fc4'
const SPRING_COIL = '#0a4f9e'
const DIAPHRAGM = '#9333ea'
const BULB_COLOR = '#E8A020'
const LINE_COLOR = '#E8A020'
const LINE_WIDTH = 8

type TEVProps = {
  position: { inlet: Point; outlet: Point; Bulb: Point }
  scale?: number
}

export const TEV = ({ position, scale = 1 }: TEVProps) => {
  const s = scale

  // Centre on midpoint between inlet and outlet
  const cx = (position.inlet.x + position.outlet.x) / 2
  const cy = (position.inlet.y + position.outlet.y) / 2

  // Valve body dimensions
  const bW = 80 * s
  const bH = 100 * s
  const bX = -bW / 2
  const bY = -bH / 2

  // Diaphragm chamber at top
  const dW = 90 * s
  const dH = 28 * s
  const dX = -dW / 2
  const dY = bY - dH

  // Sensing bulb defaults below-right
  const defaultBulb = { x: cx + bW / 2 + 110 * s, y: cy + bH * 0.3 }
  const bp = position.Bulb ?? defaultBulb
  const bulbW = 12 * s
  const bulbH = 30 * s

  // Capillary tube path: from diaphragm top → right → down to bulb
  const capTopY = cy + dY - 8 * s
  const capPts = [
    cx,
    capTopY,
    cx,
    capTopY - 14 * s,
    bp.x,
    capTopY - 14 * s,
    bp.x,
    bp.y - bulbH / 2,
  ]

  return (
    <Group>
      {/* ── Inlet pipe (from condenser → left of valve) ── */}
      <Line
        points={[
          position.inlet.x - 20,
          position.inlet.y,
          position.inlet.x + 20,
          position.inlet.y,
        ]}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
        lineCap="round"
      />

      {/* ── Outlet pipe (right of valve → to evaporator) ── */}
      <Line
        points={[
          position.outlet.x,
          position.outlet.y,
          position.outlet.x,
          position.outlet.y,
        ]}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
        lineCap="round"
      />

      {/* ── Valve body ── */}
      <Group x={cx} y={cy}>
        {/* Body */}
        <Rect
          x={bX}
          y={bY}
          width={bW}
          height={bH}
          fill={VALVE_COLOR}
          stroke={VALVE_DARK}
          strokeWidth={2 * s}
          cornerRadius={4 * s}
        />

        {/* Interior channel highlight */}
        <Rect
          x={-12 * s}
          y={bY + 8 * s}
          width={24 * s}
          height={bH - 16 * s}
          fill="#fff8e8"
          opacity={0.25}
          cornerRadius={3 * s}
        />

        {/* Poppet stem */}
        <Rect
          x={-5 * s}
          y={bY + 15 * s}
          width={10 * s}
          height={bH * 0.55}
          fill={BODY_COLOR}
          cornerRadius={2 * s}
        />

        {/* Poppet head (trapezoid) */}
        <Shape
          sceneFunc={(ctx, shape) => {
            const py = bY + 15 * s + bH * 0.55
            ctx.beginPath()
            ctx.moveTo(-12 * s, py)
            ctx.lineTo(12 * s, py)
            ctx.lineTo(6 * s, py + 14 * s)
            ctx.lineTo(-6 * s, py + 14 * s)
            ctx.closePath()
            ctx.fillStrokeShape(shape)
          }}
          fill="#3b3b3b"
          stroke="#222"
          strokeWidth={s}
        />

        {/* Superheat adjustment spring */}
        {Array.from({ length: 8 }).map((_, i) => {
          const sy = bY + bH * 0.7 + i * 6 * s
          return (
            <Line
              key={i}
              points={[
                -10 * s,
                sy,
                -2 * s,
                sy + 3 * s,
                10 * s,
                sy,
                2 * s,
                sy - 3 * s,
                -10 * s,
                sy,
              ]}
              stroke={i % 2 === 0 ? SPRING_COLOR : SPRING_COLOR}
              strokeWidth={2 * s}
            />
          )
        })}

        {/* Diaphragm chamber */}
        <Rect
          x={dX}
          y={dY}
          width={dW}
          height={dH}
          fill={VALVE_COLOR}
          stroke={VALVE_DARK}
          strokeWidth={2 * s}
          cornerRadius={[8 * s, 8 * s, 0, 0]}
        />

        {/* Diaphragm membrane (wavy purple) */}
        <Shape
          sceneFunc={(ctx, shape) => {
            const my = dY + dH * 0.55
            ctx.beginPath()
            ctx.moveTo(dX + 6 * s, my)
            for (let i = 0; i <= 6; i++) {
              const px = dX + 6 * s + (i / 6) * (dW - 12 * s)
              ctx.lineTo(px, my + (i % 2 === 0 ? -4 * s : 4 * s))
            }
            ctx.strokeShape(shape)
          }}
          stroke={DIAPHRAGM}
          strokeWidth={3.5 * s}
          fill="transparent"
        />
      </Group>

      {/* ── Capillary tube + sensing bulb ── */}
      <Group>
        <Line
          points={capPts}
          stroke={VALVE_COLOR}
          strokeWidth={LINE_WIDTH * s * 0.65}
          lineJoin="round"
        />
        <Rect
          x={bp.x - bulbW / 2}
          y={bp.y - bulbH / 2}
          width={bulbW}
          height={bulbH}
          fill="white"
          stroke={VALVE_COLOR}
          strokeWidth={LINE_WIDTH * s * 0.65}
          cornerRadius={bulbW / 2}
        />
      </Group>
    </Group>
  )
}
