import { Point } from '@/features/diagram-drawer/types'
import {
  createParticle,
  moveParticles,
} from '@/features/simulator/physics/particles'
import { Particle, Pipe } from '@/features/simulator/types'
import Konva from 'konva'
import { useEffect, useRef, useState } from 'react'
import { Group, Line, Rect } from 'react-konva'
import { useInterval } from 'usehooks-ts'

const flattenPoints = (points: Point[]) => {
  return points.flatMap((point) => [point.x, point.y])
}

export const PipeNetwork = ({
  animate,
  pipes,
  pressure,
}: {
  animate: boolean
  pipes: Pipe[]
  pressure: { LP: number; HP: number }
}) => {
  const groupRef = useRef<Konva.Group>(null)
  const [particles, setParticles] = useState<Particle[]>([])

  const delay = 1000

  useInterval(
    () => {
      const newParticle = createParticle(pipes[0])
      if (!newParticle) return

      setParticles([...particles, newParticle])
    },
    animate ? delay : null,
  )

  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    const layer = group.getLayer()
    if (!layer) return

    const anim = new Konva.Animation(() => {
      moveParticles(group, pipes, pressure)
    }, layer)

    anim.start()

    return () => {
      anim.stop()
    }
  }, [animate, pipes])

  return (
    <Group ref={groupRef}>
      {pipes.map((pipe) => (
        <Line
          id={pipe.id}
          key={pipe.id}
          points={flattenPoints(pipe.points)}
          stroke="#B87333"
          strokeWidth={pipe.pressure === 'LP' ? 8 : 8}
          lineCap="round"
          lineJoin="round"
          listening={false}
        />
      ))}

      {particles.map((particle) => (
        <Group key={particle.id}>
          {/*<Circle
            pipeId={particle.pipeId}
            name="particle"
            segmentIndex={particle.segmentIndex}
            t={particle.t}
            direction={particle.direction}
            x={particle.x}
            y={particle.y}
            fill="white"
            radius={5}
            key={particle.id}
          />*/}

          <Rect
            pipeId={particle.pipeId}
            segmentIndex={particle.segmentIndex}
            t={particle.t}
            direction={particle.direction}
            name="particle"
            key={particle.id}
            width={8}
            height={6}
            offsetY={3}
            offsetX={4}
            fill="black"
            stroke="black"
            strokeWidth={1}
            x={particle.x}
            y={particle.y}
            cornerRadius={2}
            listening={false}
          />
        </Group>
      ))}
    </Group>
  )
}
