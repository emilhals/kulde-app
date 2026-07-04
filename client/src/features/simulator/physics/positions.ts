import { getCompressorPorts } from '../geometry/compressor'
import { generateCoilPoints } from '../geometry/heatexchanger'
import { Pipe } from '../types'

export const compressorPosition = { x: 600, y: 400 }
export const condenserPosition = { x: 100, y: 50 }
export const evaporatorPosition = { x: 900, y: 100 }
export const tevPosition = {
  inlet: { x: 600, y: 200 },
  outlet: { x: 660, y: 250 },
  Bulb: { x: 1230, y: 150 },
}

export const compressorPorts = getCompressorPorts(compressorPosition)

export const condenserCoilPoints = generateCoilPoints({
  position: condenserPosition,
  flip: false,
})

export const evaporatorCoilPoints = generateCoilPoints({
  position: evaporatorPosition,
  flip: true,
})

export const coilPoints = generateCoilPoints({ position: condenserPosition })

export const condenserPorts = {
  inlet: { id: 'condenser.inlet', ...coilPoints[0] },
  outlet: { id: 'condenser.outlet', ...coilPoints[coilPoints.length - 1] },
}

export const pipes: Pipe[] = [
  {
    id: 'compressor-to-condenser',
    from: compressorPorts.outlet,
    to: condenserPorts.inlet,
    points: [
      compressorPorts.outlet,
      { x: condenserPorts.inlet.x - 40, y: compressorPorts.outlet.y },
      { x: condenserPorts.inlet.x - 40, y: condenserPorts.inlet.y },
      condenserPorts.inlet,
    ],
    nextPipeId: 'condenser-coil',
    pressure: 'HP',
  },
  {
    id: 'condenser-coil',
    from: condenserCoilPoints[0],
    to: condenserCoilPoints[condenserCoilPoints.length - 1],
    points: condenserCoilPoints,
    nextPipeId: 'condenser-to-tev',
    pressure: 'HP',
  },
  {
    id: 'condenser-to-tev',
    from: condenserCoilPoints[condenserCoilPoints.length - 1],
    to: tevPosition.inlet,
    points: [
      condenserCoilPoints[condenserCoilPoints.length - 1],
      {
        x: tevPosition.inlet.x,
        y: condenserCoilPoints[condenserCoilPoints.length - 1].y,
      },
    ],
    nextPipeId: 'tev',
    pressure: 'HP',
  },
  {
    id: 'tev',
    from: tevPosition.inlet,
    to: tevPosition.outlet,
    points: [
      tevPosition.inlet,
      { x: tevPosition.inlet.x + 30, y: tevPosition.inlet.y },
      { x: tevPosition.inlet.x + 30, y: tevPosition.outlet.y },
      tevPosition.outlet,
    ],
    pressure: 'LP',
    nextPipeId: 'tev-to-evaporator',
  },
  {
    id: 'tev-to-evaporator',
    from: tevPosition.outlet,
    to: evaporatorCoilPoints[0],
    points: [tevPosition.outlet, evaporatorCoilPoints[0]],
    pressure: 'LP',
    nextPipeId: 'evaporator-coil',
  },
  {
    id: 'evaporator-coil',
    from: evaporatorCoilPoints[0],
    to: evaporatorCoilPoints[evaporatorCoilPoints.length - 1],
    points: evaporatorCoilPoints,
    pressure: 'LP',
    nextPipeId: 'evaporator-to-compressor',
  },
  {
    id: 'evaporator-to-compressor',
    from: evaporatorCoilPoints[evaporatorCoilPoints.length - 1],
    to: compressorPorts.inlet,
    points: [
      evaporatorCoilPoints[evaporatorCoilPoints.length - 1],
      {
        x: evaporatorCoilPoints[evaporatorCoilPoints.length - 1].x + 100,
        y: evaporatorCoilPoints[evaporatorCoilPoints.length - 1].y,
      },
      {
        x: evaporatorCoilPoints[evaporatorCoilPoints.length - 1].x + 100,
        y: compressorPorts.inlet.y,
      },
      compressorPorts.inlet,
    ],
    pressure: 'LP',
  },
]
