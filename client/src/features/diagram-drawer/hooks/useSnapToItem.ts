import { useRef } from 'react'
import Konva from 'konva'

import {
  Edge,
  Geometry,
  Item,
  SnapPoint,
} from '@/features/diagram-drawer/types'
import { diagramHistory } from '@/features/diagram-drawer/store/diagram-state'
import { SNAP_RANGE } from '@/features/diagram-drawer/constants/canvas'

const findSnapPoint = () => {
  const snap = (
    geometry: { edges: Edge[]; position: number },
    guides: number[],
    snapState: { in: number; out: number },
  ): SnapPoint | null => {
    let minDistance = Infinity
    let snapPoint: SnapPoint | null = null

    geometry.edges.forEach((edge) => {
      for (const guide of guides) {
        const distance = Math.abs(guide - edge.value)

        if (distance < minDistance && distance <= snapState.in) {
          minDistance = distance
          snapPoint = {
            alignment: edge.alignment,
            guide: guide,
            position: guide - (edge.value - geometry.position),
          }
        }
      }
    })

    if (snapPoint) {
      return snapPoint
    }

    return null
  }

  return { snap }
}

type SnapState = { x: SnapPoint | null; y: SnapPoint | null }

export const useSnapToItem = (isSnapping: boolean, guideColor: string) => {
  const snapStateRef = useRef<SnapState>({ x: null, y: null })
  const lineXRef = useRef<Konva.Line | null>(null)
  const lineYRef = useRef<Konva.Line | null>(null)

  const { snap } = findSnapPoint()

  const drawGuides = (stage: Konva.Stage) => {
    const layer = stage.getLayers().find((l) => l.id() === 'preview-layer')
    if (!layer) return

    if (!lineXRef.current) {
      const lineX = new Konva.Line({
        points: [0, -6000, 0, 6000],
        stroke: guideColor,
        strokeWidth: 1,
        name: 'guide-line',
        dash: [4, 6],
      })
      layer.add(lineX)
      lineXRef.current = lineX
      lineXRef.current.visible(false)
    }

    if (!lineYRef.current) {
      const lineY = new Konva.Line({
        points: [-6000, 0, 6000, 0],
        stroke: guideColor,
        strokeWidth: 1,
        name: 'guide-line',
        dash: [4, 6],
      })
      layer.add(lineY)
      lineYRef.current = lineY
      lineYRef.current.visible(false)
    }
  }

  const applyItemSnap = (stage: Konva.Stage, itemProxy: Item) => {
    if (!isSnapping) return
    drawGuides(stage)

    const lineY = lineYRef.current
    const lineX = lineXRef.current
    if (!lineY || !lineX) return

    const geometryX: Geometry = {
      edges: [
        { alignment: 'start', value: itemProxy.x },
        { alignment: 'center', value: itemProxy.x + itemProxy.width / 2 },
        { alignment: 'end', value: itemProxy.x + itemProxy.width },
      ],
      position: itemProxy.x,
    }

    const geometryY: Geometry = {
      edges: [
        { alignment: 'start', value: itemProxy.y },
        { alignment: 'center', value: itemProxy.y + itemProxy.height / 2 },
        { alignment: 'end', value: itemProxy.y + itemProxy.height },
      ],
      position: itemProxy.y,
    }

    const guidesX = [0, stage.width() / 2, stage.width()]
    const guidesY = [0, stage.height() / 2, stage.height()]

    diagramHistory.value.items
      .filter((i) => i.id !== itemProxy.id)
      .forEach((item) => {
        const guideX = [item.x, item.x + item.width / 2, item.x + item.width]
        guidesX.push(...guideX)

        const guideY = [item.y, item.y + item.height / 2, item.y + item.height]
        guidesY.push(...guideY)
      })

    if (snapStateRef.current.x) {
      let edge = 0
      switch (snapStateRef.current.x.alignment) {
        case 'start':
          edge = itemProxy.x
          break
        case 'center':
          edge = itemProxy.x + itemProxy.width / 2
          break
        case 'end':
          edge = itemProxy.x + itemProxy.width
          break
      }

      const distance = Math.abs(edge - snapStateRef.current.x.guide)

      if (distance <= SNAP_RANGE.out) {
        itemProxy.x = snapStateRef.current.x.position

        lineX.visible(true)
        lineX.absolutePosition({ x: snapStateRef.current.x.guide, y: 0 })
      } else {
        snapStateRef.current.x = null
        lineX.visible(false)
      }
    }

    if (!snapStateRef.current.x) {
      const snapX: SnapPoint | null = snap(geometryX, guidesX, {
        in: 5,
        out: 8,
      })
      if (snapX) {
        itemProxy.x = snapX.position
        snapStateRef.current.x = snapX

        lineX.visible(true)
        lineX.absolutePosition({ x: snapX.guide, y: 0 })
      } else {
        lineX.visible(false)
      }
    }

    if (snapStateRef.current.y) {
      let edge = 0
      switch (snapStateRef.current.y.alignment) {
        case 'start':
          edge = itemProxy.y
          break
        case 'center':
          edge = itemProxy.y + itemProxy.height / 2
          break
        case 'end':
          edge = itemProxy.y + itemProxy.height
          break
      }
      const distance = Math.abs(edge - snapStateRef.current.y.guide)

      if (distance <= SNAP_RANGE.out) {
        itemProxy.y = snapStateRef.current.y.position

        lineY.visible(true)
        lineY.absolutePosition({ x: 0, y: snapStateRef.current.y.guide })
      } else {
        snapStateRef.current.y = null
        lineY.visible(false)
      }
    }

    if (!snapStateRef.current.y) {
      const snapY: SnapPoint | null = snap(geometryY, guidesY, {
        in: 5,
        out: 8,
      })
      if (snapY) {
        itemProxy.y = snapY.position
        snapStateRef.current.y = snapY

        lineY.visible(true)
        lineY.absolutePosition({ x: 0, y: snapY.guide })
      } else {
        lineY.visible(false)
      }
    }
  }

  const resetItemSnap = () => {
    snapStateRef.current = { x: null, y: null }
    lineXRef.current?.visible(false)
    lineYRef.current?.visible(false)
  }

  return { applyItemSnap, resetItemSnap }
}
