import { Stage, Layer, Rect, Transformer } from "react-konva"
import Konva from "konva"
import React, { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { useSnapshot } from "valtio"

import { Check, ChevronsUpDown, Spline, SquareDashedMousePointer, Type, Plus, Download } from "lucide-react"

import { ACTIONS, COMPONENTS } from "../constants"
import { store } from "../store"

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
  navigationMenuTriggerStyle,
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


import { Input } from "@/components/ui/input"

function DiagramPage() {
  /* konva related */
  const stageRef = useRef<Konva.Stage>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  const [action, setAction] = useState(ACTIONS.SELECT)
  const [items, setItem] = useState<any[]>([])
  const isPainting = useRef(false)
  const currentShapeId = useRef<String>("")
  const [selectedItem, setSelectedItem] = useState<Konva.Node>()

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

    console.log('changed size: ', size.width)
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)

  }, [])


  let stageWidth = size.width % 2 !== 0 ? size.width - 1 : size.width
  let stageHeight = size.height % 2 !== 0 ? size.height - 1 : size.height

  /*
   * TODO: Må være en slags liste, valtio?
   *
   * */

  const addItem = () => {
    const id = uuidv4()

    store.items.push({
      id: id,
      x: 20,
      y: 20,
      type: "test"
    })

    console.log(store.items)
  }


  const onPointerUp = () => {
    isPainting.current = false
    setAction(ACTIONS.SELECT)
  }

  const onPointerDown = () => {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current
    const { x, y } = stage?.getPointerPosition()!

    isPainting.current = true

    switch (action) {
      case ACTIONS.MOVE:
        break
    }

  }

  const onPointerMove = () => {
    if (action === ACTIONS.SELECT || !isPainting.current) return;

    const stage = stageRef.current
    const { x, y } = stage?.getPointerPosition()!


    switch (action) {
      case ACTIONS.ADD:
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
        )
    }
  }

  const onClick = (e: any) => {
    if (action !== ACTIONS.SELECT) return

    const target = e.currentTarget
    transformerRef.current?.nodes([target])

    setSelectedItem(target)
  }

  const deleteItem = (e: any) => {
    selectedItem.destroy()

    console.log(selectedItem)
  }

  const exportCanvas = () => {
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-0 z-10 w-full py-2">
        <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg">
          <button onClick={() => setAction(ACTIONS.SELECT)} className={action === ACTIONS.SELECT ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
            <SquareDashedMousePointer className="size-5"></SquareDashedMousePointer>
          </button>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <PlusIcon className="justify-center size-5"></PlusIcon>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            {value}
                          </div>
                          <img className="" src="../assets/images/components/compressor.png" />
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
                    <Button onClick={() => { addItem() }} variant="outline">
                      Add component
                    </Button>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <button onClick={() => setAction(ACTIONS.SCRIBBLE)} className={action === ACTIONS.SCRIBBLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
            <Type className="size-5"></Type>
          </button>

          <button className="p-1 rounded hover:bg-violet-100" >
            <Spline className="size-5"></Spline>
          </button>

          <button onClick={exportCanvas} className="p-1 rounded hover:bg-violet-100" >
            <ArrowDownTrayIcon className="size-5"></ArrowDownTrayIcon>
          </button>
        </div>
      </div>

      <ContextMenu>
        <ContextMenuTrigger>
          <Stage ref={stageRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} className="border-blue-50" width={stageWidth} height={stageHeight}>
            <Layer>
              <Rect onClick={() => { transformerRef.current?.nodes([]) }} x={0} y={0} height={stageHeight} width={stageWidth} fill="white" stroke="black" strokeWidth={4} id="bg" />

              {snap.items
                .map(({ id, x, y }) => {
                  return (
                    <Rect onContextMenu={(e) => { setSelectedItem(e.target.id()) }} draggable key={id} x={x} y={y} stroke="black" strokeWidth={2} fill="red" height={100} width={100} onClick={onClick} />
                  )
                })}
              <Transformer ref={transformerRef} />
            </Layer>
          </Stage>
        </ContextMenuTrigger>
        {selectedItem ? (
          <ContextMenuContent className="w-64">
            <ContextMenuItem inset>
              <button className="bg-white font-bold hover:border-0" onClick={(e) => { deleteItem(e) }}>Delete</button>
              <ContextMenuShortcut>⌘[d]</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        ) : null}
      </ContextMenu>
    </div>
  )
}

export default DiagramPage
