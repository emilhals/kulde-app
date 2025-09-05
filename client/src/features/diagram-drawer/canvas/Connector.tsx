import React, { useRef, useState, useEffect } from 'react'

import { Line, Layer } from 'react-konva'
import Konva from 'konva'
import { KonvaEventObject } from 'konva/lib/Node'

import { useSnapshot } from 'valtio'
import { store } from '@/store'

import {
  PointType,
  ItemType,
  ConnectionPreview,
} from '@/features/diagram-drawer/types'
import { Border } from './Border'

import { useAddToStore } from '@/hooks/useAddToStore'

import { createConnectionPoints } from '@/features/diagram-drawer/utils/createConnectionPoints'
import {
  hasIntersection,
  getOffset,
} from '@/features/diagram-drawer/utils/helpers'

export const Connector = ({
  stageRef,
  selected,
}: {
  stageRef: React.RefObject<Konva.Stage>
  selected: ItemType
}) => {
  const [hovered, setHovered] = useState<ItemType>()

  const [initialAnchor, setInitialAnchor] = useState<string>('')
  const [activeAnchor, setActiveAnchor] = useState<string>('')

  const snap = useSnapshot(store)

  const lineRef = useRef<Konva.Line>(null)

  const [connection, setConnection] = useState<ConnectionPreview>({
    from: null,
    to: null,
    points: [],
    offsets: {
      from: {
        placement: '',
        position: { x: 0, y: 0 },
      },
      to: {
        placement: '',
        position: { x: 0, y: 0 },
      },
    },
    type: 'connections',
  })
  const [connectionPreview, setConnectionPreview] = useState<React.ReactNode>()

  const addConnection = (connection: ConnectionPreview) => {
    console.log('from addConnection: ', connection.to)

    const newConnection: ConnectionPreview = {
      from: connection.from,
      to: connection.to,
      points: connection.points,
      offsets: {
        from: connection.offsets.from,
        to: connection.offsets.to,
      },
      type: connection.type,
    }
    useAddToStore(newConnection)

    setHovered(undefined)

    setConnection({
      from: null,
      to: null,
      points: [],
      offsets: {
        from: {
          placement: '',
          position: { x: 0, y: 0 },
        },
        to: {
          placement: '',
          position: { x: 0, y: 0 },
        },
      },
      type: 'connections',
    })
  }

  useEffect(() => {
    console.log('addad')
  }, [store.selected])

  const detectConnection = (position: PointType) => {
    const intersection = stageRef.current?.find('.object').find((obj) => {
      return selected?.id !== obj.id() && hasIntersection(position, obj)
    })

    if (intersection) {
      const item = snap.items.find((item) => item.id === intersection.id())
      if (!item) return

      setHovered(item)
      return item
    } else {
      setHovered(undefined)
    }
  }

  const detectAnchor = (position: PointType) => {
    const intersection = stageRef.current?.find('.anchor').find((obj) => {
      return hasIntersection(position, obj)
    })

    if (intersection) {
      return intersection
    }
  }

  const handleAnchorDragStart = (e: KonvaEventObject<DragEvent>) => {
    const position = e.target.position()

    setInitialAnchor(e.target.id())

    const item = snap.items.find((item) => item.id === snap.selected?.id)
    if (!item) return

    setConnection({
      ...connection,
      from: item,
    })

    setConnectionPreview(
      <Line
        x={position.x}
        y={position.y}
        points={[position.x, position.y, position.x, position.y]}
        strokeWidth={4}
        stroke="#2d9cdb"
        lineJoin="round"
        lineCap="round"
        perfectDrawEnabled={false}
        shadowBlur={1}
        shadowColor="#ffffff"
        shadowOpacity={0.5}
      />,
    )
  }

  const handleAnchorDragMove = (e: KonvaEventObject<DragEvent>) => {
    const position = e.target.position()
    const stage = e.target.getStage()
    const pointerPosition = stage?.getPointerPosition()

    const container = stage?.container()
    if (!container) return
    container.style.cursor = 'grab'

    if (!pointerPosition) return
    const mousePosition = {
      x: pointerPosition.x - position.x,
      y: pointerPosition.y - position.y,
    }

    const clickedAnchor = e.target.id()
    const anchorPosition = stageRef.current?.find('#' + clickedAnchor)[0]

    detectConnection(pointerPosition)
    const hoveredAnchor = detectAnchor(pointerPosition)

    if (hoveredAnchor && detectConnection(pointerPosition)) {
      setActiveAnchor(hoveredAnchor.id())
    }

    /*
        const animation = new Konva.Animation(() => {
          if (!lineRef.current) return
          const points = lineRef.current.points()
          const easing = 0.05
    
          points[-1] += (pointerPosition.y - points[-1]) * easing
          points[-2] += (pointerPosition.x - points[-2]) * easing
    
          lineRef.current.points(points)
        })
    
        animation.start()
    */
    setConnectionPreview(
      <Line
        ref={lineRef}
        x={position.x}
        y={position.y}
        points={[0, 0].concat(
          createConnectionPoints(mousePosition, anchorPosition, hoveredAnchor),
        )}
        strokeWidth={3}
        stroke="#2d9cdb"
        lineJoin="round"
        lineCap="round"
        listening={false}
        perfectDrawEnabled={false}
        shadowBlur={10}
        shadowOffsetY={1}
        shadowOffsetX={1}
        shadowColor="#42AEEC"
        shadowOpacity={0.5}
      />,
    )
  }
  const handleAnchorDragEnd = (e: KonvaEventObject<DragEvent>) => {
    setConnectionPreview(null)

    const stage = e.target.getStage()

    const mousePosition = stage?.getPointerPosition()
    if (!mousePosition) return

    const connectionTo = detectConnection(mousePosition)
    if (!connectionTo) return

    const item = snap.items.find((item) => item.id === connectionTo.id)
    if (!item) return

    const finishedConnection = {
      ...connection,
      to: item,
      offsets: {
        from: {
          placement: initialAnchor,
          position: getOffset(initialAnchor, connection.from),
        },
        to: {
          placement: activeAnchor,
          position: getOffset(activeAnchor, item),
        },
        type: 'connections',
      },
    }

    const container = stage?.container()
    if (!container) return
    container.style.cursor = 'default'

    setActiveAnchor('')
    setInitialAnchor('')

    addConnection(finishedConnection)
  }

  const border =
    selected !== null ? (
      <Border
        item={selected}
        onAnchorDragEnd={(e: Konva.KonvaEventObject<DragEvent>) =>
          handleAnchorDragEnd(e)
        }
        onAnchorDragMove={handleAnchorDragMove}
        onAnchorDragStart={handleAnchorDragStart}
      />
    ) : null

  const border2 =
    hovered !== null ? <Border item={hovered} hovered={activeAnchor} /> : null

  return (
    <Layer>
      {border}
      {border2}
      {connectionPreview}
    </Layer>
  )
}
