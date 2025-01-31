import { Stage, Layer, Rect, Transformer, Text, Group, Line } from "react-konva"
import Konva from "konva"
import React, { useEffect, useRef, useState } from "react"
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
  const transformerRef = useRef<Konva.Transformer>(null)
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  const [action, setAction] = useState(ACTIONS.SELECT)
  const [selectedItem, setSelectedItem] = useState<string>()

  const [itemLabel, setItemLabel] = useState('')

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const snap = useSnapshot(store)

  /* konva related functions */
  useEffect(() => {
    const checkSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])


  let stageWidth = size.width % 2 !== 0 ? size.width - 1 : size.width
  let stageHeight = size.height % 2 !== 0 ? size.height - 1 : size.height

  const addItem = (type: string, label: string) => {
    const id = uuidv4()
    store.items.push({
      id: id,
      x: 20,
      y: 20,
      type: type,
      label: label,
      img: type + ".png"
    })
    setSelectedItem(undefined)
    setAction(ACTIONS.SELECT)
  }


  const onPointerUp = () => {
    console.log('Pointer Up')
    switch (action) {
      case ACTIONS.SELECT:
    }
  }

  const onPointerDown = (e: any) => {
    console.log('Pointer down on:')
    switch (action) {
      case ACTIONS.CONNECTOR:
        break
      case ACTIONS.SELECT:
        const target = e.currentTarget
        transformerRef.current?.nodes([target])
        break
    }

  }

  const onPointerMove = () => {
    if (action === ACTIONS.SELECT) return;
    console.log('Pointer move')


    switch (action) {
      case ACTIONS.ADD:
      /* 
      setItem((items) =>
        items.map((item) => {
          if (item.id === currentShapeId.current) {
            return {
              ...item,
              width: x - item.x,
              height: y - item.y,
            }
          }
          return item;
        })
      )*/
    }
  }
  /*
   * 
   * TODO: fjern selectedItem når man klikker scenen
   *
   *
  */
  const onClick = (e: any) => {
    console.log('Clicked on: ', e.target)
    switch (action) {
      case ACTIONS.SELECT:
        break
      case ACTIONS.CONNECTOR:
        let from = getItem()
        if (from) {
          console.log("From: " + from.id)
        } else {
          console.log("Couldn't get from")
        }
        break
    }

  }

  const getItem = () => {
    const item = store.items.find((item) => item.id === selectedItem)
    if (item) {
      return item
    } else {
      console.log("Couldn't get item")
    }
  }

  const deleteItem = () => {
    const index = store.items.findIndex((item) => item.id === selectedItem)
    if (index >= 0) {
      store.items.splice(index, 1)
    }
    setSelectedItem(undefined)
  }

  const exportCanvas = () => {
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
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
                <NavigationMenuItem>
                  <NavigationMenuTrigger onPointerMove={(e) => e.preventDefault()} onPointerLeave={(e) => e.preventDefault()}>
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
        <ContextMenuTrigger onClick={() => console.log('hei')}>
          <Stage ref={stageRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} className="border-blue-50" width={stageWidth} height={stageHeight}>
            <Layer>
              <Rect onClick={() => { transformerRef.current?.nodes([]) }} x={0} y={0} height={stageHeight} width={stageWidth} fill="white" stroke="black" strokeWidth={4} id="bg" />

              {snap.items
                .map(({ id, x, y, label }) => {
                  return (
                    <Group key={id} ref={groupRef} draggable onDragStart={() => { setAction(ACTIONS.SELECT) }} onDragEnd={() => { setAction(ACTIONS.SELECT) }}>
                      <Text fontSize={15} text={label} x={x + 30} y={y - 20}></Text>
                      <Rect key={id} x={x} y={y} stroke="black" strokeWidth={2} fill="red" height={100} width={100} onClick={onClick} />
                      {selectedItem && (
                        <Transformer ref={transformerRef} />
                      )}
                      {action == ACTIONS.CONNECTOR && (
                        <Group>
                          <Rect x={x / 2} y={y * 3} stroke="black" strokeWidth={2} fill="white" height={10} width={10}></Rect>
                          <Rect x={x * 6} y={y * 3} stroke="black" strokeWidth={2} fill="white" height={10} width={10}></Rect>
                          <Rect x={x * 3} y={y * 6} stroke="black" strokeWidth={2} fill="white" height={10} width={10}></Rect>
                          <Rect x={x / 2} y={y * 3} stroke="black" strokeWidth={2} fill="white" height={10} width={10}></Rect>
                        </Group>
                      )}

                    </Group>
                  )
                })}
            </Layer>
          </Stage>
        </ContextMenuTrigger>
        {selectedItem ? (
          <ContextMenuContent className="w-64">
            <ContextMenuItem>
              <Label>Information</Label>
            </ContextMenuItem>
            <ContextMenuItem inset>
              <Label>{getItem()?.label}</Label>
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
