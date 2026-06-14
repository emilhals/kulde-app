import Konva from 'konva'
import { RefObject } from 'react'
import { Circle, Group, Line, Rect } from 'react-konva'

type PipeProps = { stageRef: RefObject<Konva.Stage>; x: number; y: number }

export const Pipe = ({ stageRef, x, y }: PipeProps) => {
  const createParticles = (n: number) => {
    const stage = stageRef.current
    if (!stage) return null

    const particles = []
    for (let p = 0; p < n; p++) {
      const particle = (
        <Circle
          key={`particle-${p}`}
          id="particle"
          y={105}
          x={20}
          radius={1}
          fill="black"
        />
      )
      particles.push(particle)
    }
    return <Group>{particles}</Group>
  }

  return (
    <Group x={x} y={y} key="pipe">
      <Rect x={10} y={100} fill="red" height={10} width={220} />

      <Rect x={230} y={100} fill="blue" height={80} width={10} />

      {createParticles(3)}
      <Line
        id="top"
        key="top"
        stroke="black"
        strokeWidth={1}
        lineCap="round"
        lineJoin="round"
        tension={0.05}
        points={[10, 100, 200, 100, 240, 100, 240, 180]}
      />
      <Line
        id="bottom"
        key="bottom"
        stroke="black"
        strokeWidth={1}
        lineCap="round"
        lineJoin="round"
        tension={0.05}
        points={[10, 110, 200, 110, 230, 110, 230, 180]}
      />
    </Group>
  )
}
