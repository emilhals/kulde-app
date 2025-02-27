import { Stage, Layer, Rect } from "react-konva"
import Konva from "konva"
import { useEffect, useRef, useState, useContext } from 'react'

import { useSnapshot } from "valtio"

/* temp */
import { v4 } from "uuid"

import { store } from "@/store"

import { ACTIONS } from '@/common/constants'
import { ItemType, LineType, SelectionType } from "@/common/types"

import { Text } from '@/components/diagram/Text'
import { Item } from "@/components/diagram/Item"
import { Line } from "@/components/diagram/Line"
import { Actionbar } from '@/components/diagram/Actionbar'
import { Selection } from "@/components/diagram/Selection"
import { KonvaEventObject } from "konva/lib/Node"

import { useCustomFont } from "@/hooks/useCustomFont"

import { ActionContext } from '@/common/ActionContext'

const DiagramPage = () => {

  /* konva related */
  const stageRef = useRef<Konva.Stage>(null)
  const [size, setSize] = useState({ width: window.innerWidth, height: 900 })

  const selectRef = useRef<Konva.Rect>(null)

  /* ui related */
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontLoaded] = useCustomFont('Open Sans:300,500')

  /* valtio */
  const snap = useSnapshot(store)

  const actionContext = useContext(ActionContext)

  /* set stage size and ensure responsiveness  */
  useEffect(() => {
    if (!containerRef.current) return

    let scale = containerRef.current.offsetWidth / size.width
    const checkSize = () => {
      let stageWidth = size.width * scale
      let stageHeight = size.height * scale

      setSize({
        width: stageWidth,
        height: stageHeight
      })
    }

    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  let stageWidth = size.width % 2 !== 0 ? size.width - 1 : size.width
  let stageHeight = size.height % 2 !== 0 ? size.height - 1 : size.height

  const [selecting, setSelecting] = useState<boolean>(false)
  const selection = useRef<SelectionType>({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
    show: false,
    moving: false
  })

  const [connecting, setConnecting] = useState<boolean>(false)
  const [from, setFrom] = useState<ItemType>(null)
  const [mid, setMid] = useState<ItemType>(null)
  const [to, setTo] = useState<ItemType>(null)

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault()

    const stage = e.target.getStage()
    const pointer = stage?.getPointerPosition()


    if (!pointer || !actionContext) return

    switch (actionContext.action) {
      case ACTIONS.SELECT:
        if (e.target !== stageRef.current || actionContext?.action !== ACTIONS.SELECT) return
        selection.current.x1 = pointer.x
        selection.current.y1 = pointer.y
        selection.current.x2 = pointer.x
        selection.current.y2 = pointer.y
        selection.current.show = true
        setSelecting(true)
        break
      case ACTIONS.CONNECTOR:
        if (e.target === stageRef.current) return
        const clickedNode = snap.items.find((item) => item.id === e.target.id())

        if (!from) {
          setConnecting(true)
          setFrom(clickedNode)
          setTo(pointer)
          setMid(pointer)

        } else {
          setTo(clickedNode)
          setMid(clickedNode)

          const id = v4()

          store.lines.push({
            id: id,
            from: from,
            mid: mid,
            to: to,
          })
          setConnecting(false)
        }

        break
    }

  }

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault()

    const stage = e.target.getStage()
    const pointer = stage?.getPointerPosition()

    if (!pointer) return
    switch (actionContext?.action) {
      case ACTIONS.SELECT:
        if (!selecting) return


        selection.current.x2 = pointer.x
        selection.current.y2 = pointer.y
        selection.current.moving = true


        const node = selectRef.current
        if (!node) return

        node.setAttrs({
          visible: true,
          x: Math.min(selection.current.x1, selection.current.x2),
          y: Math.min(selection.current.y1, selection.current.y2),
          width: Math.abs(selection.current.x1 - selection.current.x2),
          height: Math.abs(selection.current.y1 - selection.current.y2),
        })
        break
      case ACTIONS.CONNECTOR:
        if (!connecting) return
        setMid(pointer)
        setTo(pointer)
        break
    }

  }

  const handleMouseUp = () => {
    switch (actionContext?.action) {
      case ACTIONS.SELECT:
        setSelecting(false)

        const node = selectRef.current
        if (!node) return
        node.setAttrs({ visible: false })
        break
    }
  }
  return (
    <div ref={containerRef} className="grid">
      <div className="grow">
        <Actionbar />
        <Stage
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ width: '100%', border: '1px solid black', position: 'absolute', backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '16px 16px' }}
          ref={stageRef} width={stageWidth} height={stageHeight}>

          <Layer>
            {snap.items
              .map((item, index) => {
                return (
                  <Item key={index} item={item} />
                )
              }
              )}


            <Line from={from} mid={mid} to={to} />
            {snap.lines
              .map((line, index) => {
                return (
                  <Line key={index} from={line.from} mid={line.mid} to={line.to} />
                )
              })}


            {snap.texts
              .map((text, index) => {
                return (
                  <Text key={index} parent={text} />
                )
              })}


            <Rect
              ref={selectRef}
              listening={false}
              fill="blue"
              opacity={0.4}
              name="select"
            />
          </Layer>

        </Stage>
      </div>
    </div>
  )
}

export default DiagramPage
