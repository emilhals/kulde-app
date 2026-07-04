import { Point } from '@/features/simulator/types'

export const getCompressorPorts = (position: Point) => ({
  inlet: { id: 'compressor.inlet', x: position.x + 125, y: position.y + 60 },
  outlet: { id: 'compressor.outlet', x: position.x, y: position.y + 40 },
})

export const getCondensorPorts = (position: Point) => ({
  inlet: { id: 'compressor.inlet', x: position.x, y: position.y + 120 },
  outlet: { id: 'compressor.outlet', x: position.x + 120, y: position.y + 20 },
})
