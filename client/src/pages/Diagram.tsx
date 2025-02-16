import { Stage, Layer, Line } from "react-konva"
import Konva from "konva"
import { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { useSnapshot } from "valtio"

import { store } from "@/store"

import { ACTIONS } from '@/common/constants'

import { SelectionType } from "@/common/types"

import { Item } from "@/components/diagram/Item"
import { Actionbar } from '@/components/diagram/Actionbar'
import { Selection } from "@/components/diagram/Selection"
import { KonvaEventObject } from "konva/lib/Node"

function DiagramPage() {
  /* konva related */
  const stageRef = useRef<Konva.Stage>(null)

  const [size, setSize] = useState({ width: window.innerWidth, height: 900 })
  const [connectorFrom, setConnectorFrom] = useState<any>()
  const [connectorTo, setConnectorTo] = useState<any>()
  const [selectedItemID, setSelectedItemID] = useState<string>("")

  const [showTempLine, setShowTempLine] = useState<boolean>(false)


  const [action, setAction] = useState<string>(ACTIONS.SELECT)
  /* ui related */
  const containerRef = useRef<HTMLDivElement>()

  /* valtio */
  const snap = useSnapshot(store)

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

  const canSetTo = useRef<boolean>(false)
  const lineID = useRef<string>()

  // sets connector points for the line
  useEffect(() => {
    if (action === ACTIONS.CONNECTOR) {

      if (!connectorFrom)
        setConnectorFrom(item)

      if (connectorFrom && canSetTo.current)
        setConnectorTo(item)

      generateConnectors()
    }
  }, [selectedItemID, connectorFrom, connectorTo])


  const generateConnectors = () => {
    if (connectorFrom && !canSetTo.current) {
      startLine(connectorFrom, connectorFrom)
    }

    if (connectorTo && canSetTo.current) {
      finishLine(connectorTo)
    }
    calculateConnectorPoints()
  }

  const calculateConnectorPoints = () => {
    const item = getItem()
    if (!item) return

    const line = store.lines.find((line) => line.fromObject.id === item.id || line.toObject.id === item.id)
    if (!line) return

    // find nearest corner from mid-point

    let closestCorner
    let distance

    /*
    Object.entries(CORNERS).forEach((corner) => {
      let crnr = corner
      console.log(crnr)
 
      //distance = Math.sqrt((line.mid.x - corner.x) ** 2 + (line.mid.y - corner.y) ** 2)
    })*/

    /**
     *
     * TODO: bruk width/heigth istedenfor tall
     *        fiks offset
     * */




    /* is to the right */
    if (line.fromObject.x > line.toObject.x) {
      console.log(line.fromObject.label + " er til høyre for " + line.toObject.label)
      /* under */
      if (line.fromObject.y > line.toObject.y) {
        line.toPointsOffset = { x: 90, y: 45 }
        line.fromPointsOffset = { x: 45, y: 0 }
        line.mid = { x: line.fromObject.x + 45, y: line.toObject.y + 45 }
        //console.log("from: " + line.fromObject.label + " | to: " + line.toObject.label)

        //console.log(line.fromObject.label + " er under " + line.toObject.label)
      } else {
        //console.log(line.fromObject.label + " er over " + line.toObject.label)

        line.mid = { x: line.toObject.x + 45, y: line.fromObject.y + 45 }
        line.fromPointsOffset = { x: 0, y: 45 }
        line.toPointsOffset = { x: 45, y: 0 }
        //console.log("from: " + line.fromObject.label + " | to: " + line.toObject.label)

      }
    }

    if (line.fromObject.x < line.toObject.x) {
      // console.log(line.fromObject.label + " er til venstre for " + line.toObject.label)

      /* under */
      if (line.fromObject.y > line.toObject.y) {

        line.toPointsOffset = { x: 45, y: 90 }
        line.fromPointsOffset = { x: 90, y: 45 }
        line.mid = { x: 930 + 45, y: 645 }
        //console.log("from: " + line.fromObject.label + " | to: " + line.toObject.label)


        // console.log(line.fromObject.label + " er under " + line.toObject.label)
      } else {
        //  console.log(line.fromObject.label + " er over " + line.toObject.label)

        line.mid = { x: line.fromObject.x, y: line.toObject.y }
        line.fromPointsOffset = { x: 45, y: 90 }
        line.toPointsOffset = { x: 90, y: 45 }
        //        console.log("from: " + line.fromObject.label + " | to: " + line.toObject.label)

      }

    }
  }

  interface LineObject {
    id: string
    from: object
    mid: object
    to: object
    complete: false
  }

  const [tempLine, setTempLine] = useState<object>()

  const startLine = (from: object, to: object) => {
    const id = uuidv4()
    lineID.current = id

    setCanDrag(false)
    let line: LineObject = {
      id: id,
      from: from,
      mid: from,
      to: to,
      complete: false
    }

    setTempLine(line)
  }

  const updateLine = () => {
    if (connectorFrom && tempLine && !connectorTo) {
      canSetTo.current = true
    }
  }

  const finishLine = (to: object) => {
    const fromItem = store.items.find((item) => item.id === connectorFrom.id)
    const toItem = store.items.find((item) => item.id === connectorTo.id)

    if (connectorTo && tempLine) {
      if (connectorFrom.id !== connectorTo.id) {
        setTempLine((prev) =>
          prev ? { ...prev, to: connectorTo } : null
        )

        store.lines.push({
          id: tempLine.id,
          fromObject: connectorFrom,
          fromPointsOffset: { x: 0, y: 0 },
          mid: { x: connectorFrom.x, y: connectorFrom.y },
          toObject: to,
          toPointsOffset: { x: 0, y: 0 },
          complete: true
        })

        const line = store.lines.find((line) => line.id === tempLine.id)
        if (!line) return

        fromItem?.lines.push(line)
        toItem?.lines.push(line)

        setTempLine(undefined)
        setSelectedItemID("")
        setConnectorTo("")
        setConnectorFrom("")
        canSetTo.current = false
        setCanDrag(true)
        setAction(ACTIONS.SELECT)
      } else {
        return
      }
    }
  }

  /*
   *
   *
   * TODO: 
   *        Finn en smart løsning til å finne linjen og objekter tilhørende
   *
   *
   *
   * */

  const [selecting, setSelecting] = useState<boolean>(false)
  const [selection, setSelection] = useState<SelectionType>({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 1,
    height: 1,
    show: false
  })

  const handlePointerDown = (e: KonvaEventObject<PointerEvent>) => {
    if (e.target !== stageRef.current) return

    console.log("started selecting")

    e.evt.preventDefault()
    setSelection({
      x1: e.target.x(),
      y1: e.target.y(),
      x2: e.target.x(),
      y2: e.target.y(),
      width: 1,
      height: 1,
      show: true
    })
    setSelecting(true)
  }

  const handlePointerMove = (e: KonvaEventObject<PointerEvent>) => {
    if (!selecting) return

    console.log("move")

    console.log(selection)

    e.evt.preventDefault()
    setSelection({
      ...selection,
      x2: e.target.x(),
      y2: e.target.y()
    })
  }

  return (
    <div ref={containerRef} className="grid">
      <div className="grow">
        <Actionbar />
        <Stage
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          style={{ width: '100%', border: '1px solid black', position: 'absolute', backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '16px 16px' }} ref={stageRef} width={stageWidth} height={stageHeight}>
          <Layer>
            {snap.items
              .map((item, index) => {
                return (
                  <Item key={index} item={item} />
                )
              }
              )}

            <Selection selection={selection} />
            {tempLine && (
              <Line
                key={tempLine.id}
                id={tempLine.id}
                listening={false}
                stroke="black"
                strokeWidth={4}
                lineCap="round"
                points={[tempLine.from.x, tempLine.from.y, tempLine.mid.x, tempLine.mid.y, tempLine.to.x, tempLine.to.y]}
              />

            )}
            {snap.lines
              .map(({ id, fromObject, fromPointsOffset, toObject, toPointsOffset, mid }) => {
                return (
                  <Line
                    key={id}
                    id={id}
                    listening={false}
                    stroke="black"
                    strokeWidth={4}
                    lineCap="round"
                    points={[fromObject.x + fromPointsOffset.x,
                    fromObject.y + fromPointsOffset.y,
                    mid.x,
                    mid.y,
                    toObject.x + toPointsOffset.x,
                    toObject.y + toPointsOffset.y]}
                  />
                )
              })}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default DiagramPage
