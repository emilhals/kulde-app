import {
  getRotationFromDirection,
  normalize,
} from '@/features/simulator/physics/math'
import {
  Particle,
  ParticleNode,
  Pipe,
  Pressure,
} from '@/features/simulator/types'
import Konva from 'konva'
import { v4 as uuidv4 } from 'uuid'

export const createParticle = (pipe: Pipe) => {
  if (!pipe) return null

  const particle: Particle = {
    id: uuidv4(),
    pipeId: pipe.id,

    segmentIndex: 0,
    t: 0,
    direction: { x: 1, y: 0 },
    x: pipe.from.x,
    y: pipe.from.y,
    pressure: 'HP',
  }

  return particle
}

export const createParticles = (pipe: Pipe, n: number) => {
  if (!pipe) return null
  const particles: Particle[] = []

  for (let i = 0; i < n; i++) {
    const particle = createParticle(pipe)
    if (!particle) return

    particles.push(particle)
  }

  return particles
}

export const moveParticles = (
  group: Konva.Group,
  pipes: Pipe[],
  pressure: Pressure,
) => {
  const particles = group.find('.particle') as ParticleNode[]
  particles.forEach((particle) => {
    const initialPipe = pipes.find(
      (pipe) => pipe.id === particle.getAttr('pipeId'),
    )
    if (!initialPipe) return

    let currentPipe: Pipe = initialPipe
    let t = particle.getAttr('t')
    let segmentIndex = particle.getAttr('segmentIndex')

    const speed = currentPipe.pressure === 'LP' ? pressure.LP : pressure.HP
    t += speed

    let from = currentPipe.points[segmentIndex]
    let to = currentPipe.points[segmentIndex + 1]

    if (!from || !to) {
      segmentIndex = 0
      t = 0
      from = currentPipe.points[0]
      to = currentPipe.points[1]
    }

    while (true) {
      const from = currentPipe.points[segmentIndex]
      const to = currentPipe.points[segmentIndex + 1]
      if (!from || !to) return

      const segment = { x: to.x - from.x, y: to.y - from.y }
      const segmentLength = Math.sqrt(
        segment.x * segment.x + segment.y * segment.y,
      )

      if (t < segmentLength) break

      t -= segmentLength

      // Move on to the next pipe
      if (segmentIndex >= currentPipe.points.length - 2) {
        segmentIndex = 0

        const nextPipeId = currentPipe.nextPipeId
        if (!nextPipeId) return

        const nextPipe = pipes.find((pipe) => pipe.id === nextPipeId)
        if (!nextPipe) {
          break
        }

        currentPipe = nextPipe
        particle.setAttr('pipeId', nextPipe.id)
      } else {
        segmentIndex += 1
      }
    }

    from = currentPipe.points[segmentIndex]
    to = currentPipe.points[segmentIndex + 1]

    const direction = normalize({ x: to.x - from.x, y: to.y - from.y })
    const rotation = getRotationFromDirection(direction)

    const x = from.x + direction.x * t
    const y = from.y + direction.y * t

    const lastPipe = pipes[pipes.length - 1]
    if (
      Math.floor(x) === lastPipe.points[lastPipe.points.length - 1].x &&
      Math.floor(y) === lastPipe.points[lastPipe.points.length - 1].y
    ) {
      particle.destroy()
      return
    }

    particle.position({ x: x, y: y })

    particle.setAttr('fill', currentPipe.pressure === 'LP' ? 'blue' : 'red')
    particle.setAttr('rotation', rotation)
    particle.setAttr('segmentIndex', segmentIndex)
    particle.setAttr('t', t)
  })
}
