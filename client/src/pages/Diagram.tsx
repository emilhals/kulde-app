import { Stage, Layer, Rect, Text, Group, Line } from "react-konva"
import Konva from "konva"
import React, { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { useSnapshot } from "valtio"

import WebFont from "webfontloader"

import { Check, ChevronsUpDown, Spline, SquareDashedMousePointer, Type, Plus, Download } from "lucide-react"

import { ACTIONS, COMPONENTS } from "../constants"
import { store } from "../store"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuShortcut
} from "@/components/ui/context-menu"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function DiagramPage() {
  /* konva related */
  const stageRef = useRef<Konva.Stage>(null)
  const groupRef = useRef<Konva.Group>(null)
  const textRef = useRef<Konva.Text>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const shadowRef = useRef()

  const [size, setSize] = useState({ width: 1200, height: 900 })
  const [connectorFrom, setConnectorFrom] = useState<any>()
  const [connectorTo, setConnectorTo] = useState<any>()
  const [selectedItemID, setSelectedItemID] = useState<string>("")

  const [action, setAction] = useState<string>(ACTIONS.SELECT)
  const [showTempLine, setShowTempLine] = useState<boolean>(false)


  /* ui related */
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [itemLabel, setItemLabel] = useState('')
  const containerRef = useRef<HTMLDivElement>()

  const [fontLoaded, setFontLoaded] = useState(false)


  const gridLayer = useRef<Konva.Layer>()
  const blockSnapSize = 30


  /* valtio */
  const snap = useSnapshot(store)


  /* konva related functions */
  useEffect(() => {
    let scale = containerRef.current?.offsetWidth / size.width
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

  /* fetch fonts */
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Open Sans:400,600,700"]
      },
      fontactive: () => {
        setTimeout(() => {
          setFontLoaded(true)
        }, 1000)
      }
    })
  })


  let stageWidth = size.width % 2 !== 0 ? size.width - 1 : size.width
  let stageHeight = size.height % 2 !== 0 ? size.height - 1 : size.height

  const canSetTo = useRef<boolean>(false)
  const lineID = useRef<string>()

  useEffect(() => {
    if (action === ACTIONS.CONNECTOR) {
      let item = getItem()

      if (!connectorFrom) {
        setConnectorFrom(item)
      }
      if (connectorFrom && canSetTo.current) {
        setConnectorTo(item)
      }

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

    const obj = store.items.find((item) => item.id === item.id)
    const line = store.lines.find((line) => line.from.id === item.id || line.to.id === item.id)
  }

  interface LineObject {
    id: string
    from: object
    mid: object
    to: object
    complete: false
  }

  useEffect(() => {

  })

  const [tempLine, setTempLine] = useState<object>()

  /*
   *
   *  TODO: Lage en temp line?
   *
   * 
   * */
  const startLine = (from: object, to: object) => {
    const id = uuidv4()
    lineID.current = id

    let line: LineObject = {
      id: id,
      from: from,
      mid: from,
      to: to,
      complete: false
    }


    setTempLine(line)
    /*
        store.lines.push({
          id: id,
          from: from,
          mid: from,
          to: to,
          complete: false
        })*/
  }

  const updateLine = () => {
    const line = store.lines.find((line) => line.id === lineID.current)

    if (connectorFrom && tempLine && !connectorTo) {
      const pointer = stageRef.current?.getPointerPosition()
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
          from: connectorFrom,
          mid: connectorFrom,
          to: to,
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
        transformerRef.current?.nodes([])
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

  const calculateMidpoint = () => {
    const item = getItem()

    if (!item) return

    const line = store.lines.find((line) => line.from.id === item.id || line.to.id === item.id)

    const midPoint = {
      x: (line?.from.x),
      y: (line?.to.y)
    }

    if (line?.complete) {
      line.mid = midPoint
    }

  }

  const addItem = (type: string, label: string) => {
    const id = uuidv4()
    store.items.push({
      id: id,
      x: blockSnapSize * 3,
      y: blockSnapSize * 10,
      width: blockSnapSize * 3,
      height: blockSnapSize * 3,
      type: type,
      label: label,
      img: type + ".png",
      lines: []
    })
    setSelectedItemID("")
    setAction(ACTIONS.SELECT)
  }

  /*
  useEffect(() => {
    if (textRef.current) {
      const parent = store.items.find((item) => item.id === textRef.current.id())

      console.log("ha")

      if (!parent) return

      const labelLength = parent?.label.length
      textRef.current.position({
        x: parent.x + labelLength,
        y: parent.y + 100
      })
    }


  }, [textRef.current])

*/
  const handleText = () => {
    if (textRef.current) {
      const parent = store.items.find((item) => item.id === textRef.current.id())

      console.log("from handletext", parent.x)

      if (!parent) return
      /*
            const labelLength = parent?.label.length
            textRef.current.position({
              x: parent.x + labelLength,
              y: parent.y + 100
            }) */
    }
  }

  const onPointerUp = (e: any) => {
    switch (action) {
      case ACTIONS.CONNECTOR:
        break
    }
  }

  const onPointerDown = (e: any) => {
    switch (action) {
      case ACTIONS.SELECT:
        setSelectedItemID(e.target.id())
        break
      case ACTIONS.CONNECTOR:
        if (e.target.id() === lineID) return
        setSelectedItemID(e.target.id())
        break
    }

  }

  const onPointerMove = (e: any) => {
    switch (action) {
      case ACTIONS.SELECT:
        break
      case ACTIONS.CONNECTOR:
        if (connectorFrom) {
          handleTempLineMove()
          updateLine()
        }
        calculateMidpoint()
        calculateConnectorPoints()
        break
    }
  }

  const onClick = (e: any) => {
    if (action !== ACTIONS.SELECT) return

    const target = e.currentTarget
  }

  const handleDragMove = (e: any) => {
    gridLayer.current?.show()

    handleText()
    updateLine()
    calculateConnectorPoints()
  }

  const handleDragEnd = (e: any) => {
    let current = getItem()

    handleText()
    calculateMidpoint()
    calculateConnectorPoints()

    if (current) {
      current.x = Math.round(e.target.x() / blockSnapSize) * blockSnapSize
      current.y = Math.round(e.target.y() / blockSnapSize) * blockSnapSize
    }

    stageRef.current?.batchDraw()
    gridLayer.current?.hide()

    setAction(ACTIONS.SELECT)
  }

  const getItem = () => {
    if (!selectedItemID || selectedItemID === "bg") return undefined

    const item = store.items.find((item) => item.id === selectedItemID)
    if (!item) {
      console.log("Couldn't get item")
      return undefined
    }
    return item
  }

  const deleteItem = () => {
    const index = store.items.findIndex((item) => item.id === selectedItemID)
    const line = store.lines.findIndex((line) => line.from.id === selectedItemID || line.to.id === selectedItemID)

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

  const exportCanvas = () => {
  }

  /* when the stage is clicked */
  const handleOffsetClick = () => {
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

  return (
    <div ref={containerRef} className="relative top-10 w-full overflow-hidden">
      <div className="absolute top-0 z-10 w-full py-2">
        <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button onClick={() => setAction(ACTIONS.SELECT)} className={action === ACTIONS.SELECT ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
                  <SquareDashedMousePointer className="size-5"></SquareDashedMousePointer>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select</p>
              </TooltipContent>
            </Tooltip>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem className={action === ACTIONS.ADD ? "bg-white p-1 rounded" : "p-1 hover:bg-white rounded"}>
                  <NavigationMenuTrigger className={action === ACTIONS.ADD ? "bg-white p-1 rounded" : "p-1 hover:bg-white rounded"} onPointerMove={(e) => e.preventDefault()} onPointerLeave={(e) => e.preventDefault()}>
                    <Tooltip>
                      <TooltipTrigger onClick={() => { setAction(ACTIONS.ADD) }} className={action === ACTIONS.ADD ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
                        <Plus className="justify-center size-5"></Plus>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add item</p>
                      </TooltipContent>
                    </Tooltip>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent onPointerEnter={(e) => e.preventDefault()} onPointerMove={(e) => e.preventDefault()} onPointerLeave={(e) => e.preventDefault()}>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <img className="" src="compressor.png" />
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <Link to="#" title="Label">
                        <Input type="text" id="item-label" value={itemLabel} onChange={e => setItemLabel((e.target.value))} placeholder="Label" />
                      </Link>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                          >
                            {value
                              ? COMPONENTS.find((component) => component.value === value)?.label
                              : "Select component..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search component..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>No component found.</CommandEmpty>
                              <CommandGroup>
                                {COMPONENTS.map((component) => (
                                  <CommandItem
                                    key={component.value}
                                    value={component.value}
                                    onSelect={(currentValue) => {
                                      setValue(currentValue === value ? "" : currentValue)
                                      setOpen(false)
                                    }}
                                  >
                                    {component.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        value === component.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Button onClick={() => { addItem(value, itemLabel) }} variant="outline">
                        Add component
                      </Button>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Tooltip>
              <TooltipTrigger>
                <button onClick={() => setAction(ACTIONS.SCRIBBLE)} className={action === ACTIONS.SCRIBBLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
                  <Type className="size-5"></Type>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add text</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <button onClick={() => setAction(ACTIONS.CONNECTOR)} className={action === ACTIONS.CONNECTOR ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"} >
                  <Spline className="size-5"></Spline>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Connect items</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <button onClick={exportCanvas} className="p-1 rounded hover:bg-violet-100" >
                  <Download className="size-5"></Download>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <ContextMenu>
        <ContextMenuTrigger>
          <Stage ref={stageRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} className="border-blue-50" width={stageWidth} height={stageHeight}>
            <Layer ref={gridLayer}>
            </Layer>

            <Layer>
              <Rect onClick={handleOffsetClick} x={0} y={0} height={stageHeight} width={stageWidth} stroke="black" strokeWidth={4} id="bg" />
              <Text fontSize={15} text={selectedItemID} x={10} y={10}></Text>
              {snap.items
                .map(({ id, x, y, label, height, width }) => {
                  return (
                    <Group key={id} ref={groupRef}>
                      <Text
                        onDragMove={handleText}
                        onClick={() => console.log("click text")}
                        draggable
                        id={id}
                        ref={textRef}
                        fontSize={16}
                        fontStyle="400"
                        fontFamily={fontLoaded ? "Open Sans" : "Arial"}
                        text={label}
                        x={x}
                        y={y * 0.9}
                      />
                      <Rect id={id} key={id} draggable
                        onDragStart={() => setSelectedItemID(id)}
                        onDragMove={handleDragMove}
                        onDragEnd={handleDragEnd}
                        onContextMenu={() => { setSelectedItemID(id) }} x={x} y={y} stroke="black" strokeWidth={2}
                        fill={selectedItemID === id ? "gray" : "white"} height={height} width={width}
                        onClick={onClick} />
                    </Group>
                  )
                })}

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
                .map(({ id, from, to, mid }) => {
                  return (
                    <Line
                      key={id}
                      id={id}
                      listening={false}
                      stroke="black"
                      strokeWidth={4}
                      lineCap="round"
                      points={[from.x + 45, from.y + 90, mid.x, mid.y, to.x + 90, to.y + 45]}
                    />
                  )
                })}
            </Layer>
          </Stage>
        </ContextMenuTrigger>
        {selectedItemID ? (
          <ContextMenuContent className="w-64">
            <ContextMenuItem>
              <Label>Information</Label>
            </ContextMenuItem>
            <ContextMenuItem inset>
              <Label>{getItem()?.id}</Label>
            </ContextMenuItem>
            <ContextMenuItem inset>
              <Label>x : {getItem()?.x} | y: {getItem()?.y}</Label>
            </ContextMenuItem>
            <ContextMenuItem inset>
              <button className="bg-white font-bold hover:border-0" onClick={() => { deleteItem() }}>Delete</button>
              <ContextMenuShortcut>⌘[d]</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        ) : null}
      </ContextMenu>
      <div className="flex flex-row bg-gray-50">
        <div className="basis-128">
          <p>Items:</p>
          <ul className="basis-128">
            <li>
              {snap.items
                .map(({ id, label, x, y, lines }) => {
                  return (
                    <ul className="p-1 border">
                      <li>id: {id}</li>
                      <li>label: {label}</li>
                      <li>x: {x} | y: {y}</li>
                      {lines.map((line, index) => {
                        <p key={index}>{line.id}</p>
                      })}
                    </ul>
                  )
                })}
            </li>
          </ul>
        </div>
        <div className="basis-128">
          <p>Lines:</p>
          <ul className="basis-128">
            {snap.lines
              .map(({ id, from, to, mid }) => {
                return (
                  <li key={id} className="p-1 border">
                    <p>id: {id}</p>
                    {Array.isArray(from) ? (
                      from.map((obj, index) => (
                        <p key={index}>from: {obj.id ?? JSON.stringify(obj)}</p>
                      ))
                    ) : (
                      <ul>
                        <li>
                          from: {from.label}
                        </li>
                        <li>
                          from x: {from.x}
                        </li>
                        <li>
                          from y: {from.y}
                        </li>

                        <Separator />
                        <ul className="bg-gray-100">
                          <li>
                            to: {to.label}
                          </li>
                          <li>
                            to x: {to.x}
                          </li>
                          <li>
                            to y: {to.y}
                          </li>
                        </ul>
                        <Separator />

                        <ul className="bg-gray-200">
                          <li>
                            mid id: {mid.id}
                          </li>
                          <li>
                            mid x: {mid.x}
                          </li>
                          <li>
                            mid y: {mid.y}
                          </li>
                        </ul>
                      </ul>
                    )}
                  </li>
                )
              })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DiagramPage
