import { Stage, Layer, Rect, Text, Group, Line, Transformer } from "react-konva"
import Konva from "konva"
import React, { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { useSnapshot } from "valtio"

import { Check, ChevronsUpDown, Spline, SquareDashedMousePointer, Type, Plus, Download, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { store } from "@/store"

import { ACTIONS } from '@/common/constants'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuShortcut
} from "@/components/ui/context-menu"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"


import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Item } from "@/components/diagram/Item"
import { Actionbar } from '@/components/diagram/Actionbar'

function DiagramPage() {
  /* konva related */
  const stageRef = useRef<Konva.Stage>(null)

  const guideLineLayer = useRef<Konva.Layer>()

  const [size, setSize] = useState({ width: 900, height: 900 })
  const [connectorFrom, setConnectorFrom] = useState<any>()
  const [connectorTo, setConnectorTo] = useState<any>()
  const [selectedItemID, setSelectedItemID] = useState<string>("")
  const [canDrag, setCanDrag] = useState<boolean>(true)

  const [showTempLine, setShowTempLine] = useState<boolean>(false)


  const [action, setAction] = useState<string>(ACTIONS.SELECT)
  /* ui related */
  const containerRef = useRef<HTMLDivElement>()

  const [openItemsList, setOpenItemsList] = useState(false)

  const gridLayer = useRef<Konva.Layer>()
  const blockSnapSize = 30

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
      let item = getItem()
      if (!item) return

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

  /*
   *
   *
   * TODO: FIND NEAREST CORNER
   *
   *
   * */

  const getCorners = () => {
    return {
      topLeft: {
        x: 0,
        y: 0
      },
      topRight: {
        x: stageWidth,
        y: 0
      },
      bottomLeft: {
        x: 0,
        y: stageHeight
      },
      bottomRight: {
        x: stageWidth,
        y: stageHeight
      }
    }
  }

  const calculateConnectorPoints = () => {
    const item = getItem()
    if (!item) return

    const line = store.lines.find((line) => line.fromObject.id === item.id || line.toObject.id === item.id)
    if (!line) return

    // find nearest corner from mid-point

    let closestCorner
    let distance

    const CORNERS = getCorners()
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


  const onPointerUp = (e: any) => {
    switch (action) {
      case ACTIONS.CONNECTOR:
        break
    }
  }

  const onPointerDown = (e: any) => {
    switch (action) {
      case ACTIONS.SELECT:
        break
      case ACTIONS.CONNECTOR:
        setSelectedItemID(e.target.id())
        break
    }

  }

  const onPointerMove = () => {
    switch (action) {
      case ACTIONS.SELECT:
        break
      case ACTIONS.CONNECTOR:
        if (connectorFrom) {
          handleTempLineMove()
          updateLine()
        }
        break
    }
  }

  const handleDragMove = (e: any) => {
    // gridLayer.current?.show()

    // clear previous lines on the screen
    guideLineLayer.current?.find('.guide-line').forEach((l) => l.destroy())

    // find possible snapping lines
    let lineGuideStops = getLineGuideStops(e.target)

    // find snapping points of current object
    let itemBounds = getObjectSnappingEdges(e.target)

    // find where we can snap current object
    let guides = getGuides(lineGuideStops, itemBounds)

    if (!guides.length) return

    drawGuides(guides)

    var absPos = e.target.absolutePosition()

    // force object position
    guides.forEach((lg) => {
      switch (lg.orientation) {
        case 'V': {
          absPos.x = lg.lineGuide + lg.offset
          break
        }
        case 'H': {
          absPos.y = lg.lineGuide + lg.offset
          break
        }
      }
      e.target.absolutePosition(absPos)
    })
    calculateConnectorPoints()
    updateLine()
  }

  const handleDragEnd = (e: any) => {
    let current = getItem()
    if (!current) return

    let text = stageRef.current?.find('.text-' + selectedItemID).pop()
    if (!text) return

    current.x = e.target.x()
    current.y = e.target.y()

    guideLineLayer.current?.find('.guide-line').forEach((l) => l.destroy())
    calculateMidpoint()
    setAction(ACTIONS.SELECT)
  }


  const deleteItem = () => {
    const index = store.items.findIndex((item) => item.id === selectedItemID)
    const line = store.lines.findIndex((line) => line.fromObject.id === selectedItemID || line.toObject.id === selectedItemID)

    if (line) {
      console.log(line)
    } else {
      console.log("could not find line", line)
    }

    if (index >= 0) {
      store.items.splice(index, 1)
      if (line) store.lines.splice(line, 1)
    }
    setSelectedItemID("")
  }

  /* grid for snapping */
  useEffect(() => {
    if (gridLayer.current) {
      for (let i = 0; i < stageWidth / blockSnapSize; i++) {
        gridLayer.current.add(new Konva.Line({
          points: [Math.round(i * blockSnapSize) + 0.5, 0, Math.round(i * blockSnapSize) + 0.5, stageHeight],
          stroke: "#ddd",
          strokeWidth: 1
        }))
      }

      gridLayer.current.add(new Konva.Line({ points: [0, 0, 10, 10] }));
      for (let j = 0; j < stageHeight / blockSnapSize; j++) {
        gridLayer.current.add(new Konva.Line({
          points: [0, Math.round(j * blockSnapSize), stageWidth, Math.round(j * blockSnapSize)],
          stroke: "#ddd",
          strokeWidth: 0.5
        }))
      }

      gridLayer.current.hide()
    }
  }, [gridLayer.current])

  /* guide lines for snapping */

  //where can we snap our objects?
  const getLineGuideStops = (skipShape) => {
    // snap to stage borders and center of the stage
    let vertical = [0, stageWidth / 2, stageWidth]
    let horizontal = [0, stageHeight / 2, stageHeight]

    // snap over over edges and center of each object on the canvas
    stageRef.current?.find(".object").forEach((guideItem) => {
      if (guideItem === skipShape) return

      let box = guideItem.getClientRect()
      // snap to edges
      vertical.push([box.x, box.x + box.width, box.x + box.width / 2])
      horizontal.push([box.y, box.y + box.height, box.y + box.height / 2])
    })
    return {
      vertical: vertical.flat(),
      horizontal: horizontal.flat()
    }
  }

  const GUIDELINE_OFFSET = 5

  const getObjectSnappingEdges = (node) => {
    let box = node.getClientRect()
    let absPos = node.absolutePosition()

    return {
      vertical: [
        {
          guide: Math.round(box.x),
          offset: Math.round(absPos.x - box.x),
          snap: 'start',
        },
        {
          guide: Math.round(box.x + box.width / 2),
          offset: Math.round(absPos.x - box.x - box.width / 2),
          snap: 'center',
        },
        {
          guide: Math.round(box.x + box.width),
          offset: Math.round(absPos.x - box.x - box.width),
          snap: 'end'
        },
      ],
      horizontal: [
        {
          guide: Math.round(box.y),
          offset: Math.round(absPos.y - box.y),
          snap: 'start',
        },
        {
          guide: Math.round(box.y + box.height / 2),
          offset: Math.round(absPos.y - box.y - box.height / 2),
          snap: 'center',
        },
        {
          guide: Math.round(box.y + box.height),
          offset: Math.round(absPos.y - box.y - box.height),
          snap: 'end'
        }
      ]
    }
  }

  // find all snapping possibilites
  const getGuides = (lineGuideStops, itemBounds) => {
    let resultVertical = []
    let resultHorizontal = []

    lineGuideStops.vertical.forEach((lineGuide) => {
      itemBounds.vertical.forEach((itemBound) => {
        let diff = Math.abs(lineGuide - itemBound.guide)

        // if the distance between guide line and object snap is sloce we can consider to for snapping
        if (diff < GUIDELINE_OFFSET) {
          resultVertical.push({
            lineGuide: lineGuide,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset
          })
        }
      })
    })

    lineGuideStops.horizontal.forEach((lineGuide) => {
      itemBounds.horizontal.forEach((itemBound) => {
        let diff = Math.abs(lineGuide - itemBound.guide)

        // if the distance between guide line and object snap is close we can consider this for snapping
        if (diff < GUIDELINE_OFFSET) {
          resultHorizontal.push({
            lineGuide: lineGuide,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset
          })
        }
      })
    })

    let guides = []

    // find closest snap
    var minVertical = resultVertical.sort((a, b) => a.diff - b.diff)[0]
    var minHorizontal = resultHorizontal.sort((a, b) => a.diff - b.diff)[0]

    if (minVertical) {
      guides.push({
        lineGuide: minVertical.lineGuide,
        offset: minVertical.offset,
        orientation: 'V',
        snap: minVertical.snap
      })
    }

    if (minHorizontal) {
      guides.push({
        lineGuide: minHorizontal.lineGuide,
        offset: minHorizontal.offset,
        orientation: 'H',
        snap: minHorizontal.snap
      })
    }
    return guides
  }

  const drawGuides = (guides) => {
    guides.forEach((lg) => {
      if (lg.orientation === 'H') {
        let line = new Konva.Line({
          points: [-3000, 0, 3000, 0],
          stroke: 'rgb(0,161,255)',
          strokeWidth: 1,
          name: 'guide-line',
          dash: [4, 6],
        })
        guideLineLayer.current?.add(line)
        line.absolutePosition({
          x: 0,
          y: lg.lineGuide
        })
      } else if (lg.orientation === 'V') {
        let line = new Konva.Line({
          points: [0, -3000, 0, 3000],
          stroke: 'rgb(0,161,255)',
          strokeWidth: 1,
          name: 'guide-line',
          dash: [4, 6]
        })
        guideLineLayer.current?.add(line)
        line.absolutePosition({
          x: lg.lineGuide,
          y: 0,
        })
      }
    })
  }

  const handleTempLineMove = () => {
    if (!tempLine) return

    const stage = stageRef.current
    if (!stage) return

    const pointer = stage.getPointerPosition()
    if (!pointer) return


    setTempLine((prev) =>
      prev ? { ...prev, to: { x: pointer.x, y: pointer.y } } : null
    )
  }

  const bgRef = useRef(null)

  return (
    <div ref={containerRef} className="flex">
      <div className="flex-1">
        <Actionbar />

        <ContextMenu>
          <ContextMenuTrigger>
            <Stage style={{ width: '100%', position: 'absolute', backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '16px 16px' }} ref={stageRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} width={stageWidth} height={stageHeight}>

              <Layer ref={guideLineLayer}>
              </Layer>
              <Layer ref={gridLayer}>
              </Layer>

              <Layer>
                {snap.items
                  .map((item, index) => {
                    return (
                      <>
                        <Item key={index} item={item} />
                      </>
                    )
                  }
                  )}

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
          </ContextMenuTrigger>
          {selectedItemID && selectedItemID !== "bg" ? (
            <ContextMenuContent className="w-64">
              <ContextMenuItem inset disabled>
                <Label>{getItem()?.label}</Label>
              </ContextMenuItem>
              <Separator />
              <ContextMenuItem inset>
                <Label>Lock</Label>
              </ContextMenuItem>
              <ContextMenuItem inset>
                <button className="font-bold hover:border-0" onClick={() => { deleteItem() }}>Delete</button>
              </ContextMenuItem>
            </ContextMenuContent>
          ) : null}
        </ContextMenu>
      </div>
    </div>
  )
}

export default DiagramPage
