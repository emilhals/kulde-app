import { Stage, Layer, Rect, Transformer, Text, Group, Line } from "react-konva"
import Konva from "konva"
import React, { useEffect, useRef, useState, useReducer } from "react"
import { v4 as uuidv4 } from "uuid"

import { useSnapshot } from "valtio"

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
  const [size, setSize] = useState({ width: 1200, height: 900 })
  const [connectorFrom, setConnectorFrom] = useState<any>()
  const [connectorTo, setConnectorTo] = useState<any>()
  const [selectedItemID, setSelectedItemID] = useState<string>("")

  const [action, setAction] = useState<string>(ACTIONS.SELECT)


  /* ui related */
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [itemLabel, setItemLabel] = useState('')
  const containerRef = useRef<HTMLDivElement>()


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
      console.log("aada", size.width)
    }

    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])








  let stageWidth = size.width % 2 !== 0 ? size.width - 1 : size.width
  let stageHeight = size.height % 2 !== 0 ? size.height - 1 : size.height





  const canSetTo = useRef<boolean>(false)
  const lineID = useRef<string>()

  useEffect(() => {
    if (action === ACTIONS.CONNECTOR) {
      let item = getItem()

      if (!connectorFrom) {
        console.log("set connectorfrom", connectorFrom)
        setConnectorFrom(item)
      }
      if (connectorFrom && canSetTo.current) {
        console.log("2: ", item)
        setConnectorTo(item)
        console.log("set connectorTo", connectorTo)
      }

      generateConnectors()
    }
  }, [selectedItemID, connectorFrom, connectorTo])

  const generateConnectors = () => {
    if (connectorFrom && !canSetTo.current) {
      startLine(connectorFrom, connectorFrom)
    }

    console.log("genCon - to: ", connectorTo)
    if (connectorTo && canSetTo.current) {
      finishLine(connectorTo)
    }
  }


  const startLine = (from: object, to: object) => {
    const id = uuidv4()
    lineID.current = id
    store.lines.push({
      id: id,
      from: from,
      mid: from,
      to: to,
      complete: false
    })
    console.log("line id", lineID)
    console.log("startLine - from: ", connectorFrom)
  }

  const updateLine = (e: any) => {
    const line = store.lines.find((line) => line.id === lineID.current)
    console.log("from updateLine")

    if (connectorFrom && line) {
      const pointer = stageRef.current?.getPointerPosition()
      line.to = pointer
      line.mid = pointer
      canSetTo.current = true
    }
  }

  const finishLine = (to: object) => {
    const line = store.lines.find((line) => line.id === lineID.current)
    const fromItem = store.items.find((item) => item.id === connectorFrom.id)
    const toItem = store.items.find((item) => item.id === connectorTo.id)

    console.log("from: ", connectorFrom)
    console.log("to: ", connectorTo)

    if (connectorTo && line) {
      if (connectorFrom.id !== connectorTo.id) {
        line.to = to
        line.complete = true

        console.log("finished line: ", line?.complete)
        setSelectedItemID("")
        transformerRef.current?.nodes([])
        setAction(ACTIONS.SELECT)
      } else {
        return
      }
    }
  }

  const calculateMidpoint = () => {
    const line = store.lines.find((line) => line.id === lineID.current)
    console.log("hei")

    const midPoint = {
      x: (line?.from.x + 50),
      y: (line?.to.y + 50)
    }

    if (line?.complete) {
      line.mid = midPoint
    }
  }

  const addItem = (type: string, label: string) => {
    const id = uuidv4()
    store.items.push({
      id: id,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      type: type,
      label: label,
      img: type + ".png",
      lines: []
    })
    setSelectedItemID("")
    setAction(ACTIONS.SELECT)
  }



  /* 
   * TODO: 
   * ikke call getItem når man trykker på scenen 
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
      case ACTIONS.CONNECTOR:
        if (connectorFrom) {
          updateLine(e)
        }
        calculateMidpoint()
        break
    }
  }

  const onClick = (e: any) => {
    if (action !== ACTIONS.SELECT) return

    const target = e.currentTarget
    transformerRef.current?.nodes([target])
  }

  /* when the stage is clicked */
  const handleOffsetClick = () => {
    transformerRef.current?.nodes([])
    setSelectedItemID("")
  }

  const handleDragEnd = (e: any) => {
    let current = getItem()

    calculateMidpoint()

    if (current) {
      current.x = e.target.x()
      current.y = e.target.y()
    }
    setAction(ACTIONS.SELECT)
  }

  const getItem = () => {
    if (!selectedItemID) return undefined

    const item = store.items.find((item) => item.id === selectedItemID)
    if (!item) {
      console.log("Couldn't get item")
      return undefined
    }
    return item
  }

  const deleteItem = () => {
    console.log("delete", selectedItemID)
    const index = store.items.findIndex((item) => item.id === selectedItemID)
    if (index >= 0) {
      store.items.splice(index, 1)
    }
    setSelectedItemID("")
  }

  const exportCanvas = () => {
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
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
            <Layer>
              <Rect onClick={handleOffsetClick} x={0} y={0} height={stageHeight} width={stageWidth} fill="white" stroke="black" strokeWidth={4} id="bg" />
              <Text fontSize={15} text={selectedItemID} x={10} y={10} />


              {snap.items
                .map(({ id, x, y, label, height, width }) => {
                  return (
                    <Group key={id} ref={groupRef}>
                      <Text ref={textRef} fontSize={15} text={label} x={x + label.length} y={y + 110}></Text>
                      <Rect id={id} draggable
                        onDragStart={() => setSelectedItemID(id)}
                        onDragMove={updateLine}
                        onDragEnd={handleDragEnd}
                        onContextMenu={() => { setSelectedItemID(id) }} x={x} y={y} stroke="black" strokeWidth={2}
                        fill={selectedItemID === id ? "red" : "blue"} height={100} width={100}
                        onClick={onClick} />
                    </Group>
                  )
                })}


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
                      points={[from.x + 50, from.y + 100, mid.x, mid.y, to.x + 100, to.y + 50]}
                    />
                  )
                })}
              <Transformer ref={transformerRef} keepRatio />
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
    </div>
  )
}

export default DiagramPage
