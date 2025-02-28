import { Stage, Layer, Rect, Transformer } from "react-konva"
import Konva from "konva"
import { useEffect, useRef, useState, useContext } from 'react'

import { useSnapshot } from "valtio"

/* temp */
import { v4 } from "uuid"

import { store } from "@/store"

import { ACTIONS } from '@/common/constants'
import { ItemType, LineType } from "@/common/types"

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
  const transformerRef = useRef<Konva.Transformer>(null)

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
      case ACTIONS.CONNECTOR:
        if (e.target === stageRef.current) return
        const clickedNode = snap.items.find((item) => item.id === e.target.id())

        if (!from) {
          setConnecting(true)
          setFrom(clickedNode)
          setTo(pointer)
          setMid(pointer)

          console.log("clicked on ", clickedNode.label)
        } else {
          setTo(clickedNode)
          setMid(clickedNode)

          console.log("clicked on ", clickedNode.label)
          const id = v4()

          store.lines.push({
            id: id,
            from: from,
            mid: mid,
            to: to,
          })
          setConnecting(false)
          actionContext.updateAction(ACTIONS.SELECT)
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
      case ACTIONS.CONNECTOR:
        if (!connecting) return
        setMid(pointer)
        setTo(pointer)
        break
    }

  }


  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    switch (actionContext?.action) {
      case ACTIONS.SELECT:
        if (e.target === stageRef.current) {
          transformerRef.current?.nodes([])
          return
        }
        break
    }
  }

  return (
    <div ref={containerRef} className="flex flex-col">
      <div className="grow">
        <Actionbar />
        <Stage
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          style={{
            width: '100%', border: '1px solid black',
            backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '16px 16px'
          }}
          ref={stageRef} width={stageWidth} height={stageHeight}>

          <Layer>

            <Selection stageRef={stageRef} transformerRef={transformerRef} />
          </Layer>

          <Layer>
            {snap.items
              .map((item, index) => {
                return (
                  <Item key={index} item={item} />
                )
              }
              )}


            {connecting && (
              <Line from={from} mid={mid} to={to} />
            )}
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

          </Layer>
          <Transformer ref={transformerRef} />

        </Stage>
      </div>

      <div className="h-32 grow-0 bg-gray-50">
        <h3>Components:</h3>
        <div className="flex-col">
          <div className="basis-1/4">
            {snap.items
              .map((item, index) => {
                return (
                  <ul key={index}>
                    <li>{item.id} - {item.label}</li>
                    <li>x: {item.x} | y: {item.y}</li>
                  </ul>
                )
              }
              )}
          </div>
          <div className="basis-1/4">
            {snap.lines
              .map((line, index) => {
                return (
                  <ul key={index}>
                    <li>{line.id}</li>
                    <li>from: {line.from.x} | to: {line.to.x}</li>
                  </ul>
                )
              }
              )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default DiagramPage
