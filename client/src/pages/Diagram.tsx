import { Stage, Layer, Rect, Transformer } from "react-konva"
import Konva from "konva"
import { Html } from 'react-konva-utils';
import React, { useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { ArrowsPointingInIcon } from '@heroicons/react/24/solid'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'
import { ItalicIcon } from "@heroicons/react/24/solid"
import { PlusIcon } from "@heroicons/react/24/solid"
import { XMarkIcon } from "@heroicons/react/24/solid"

import { ACTIONS } from "../constants"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"


function DiagramPage() {
  const stageRef = useRef<Konva.Stage>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const [action, setAction] = useState(ACTIONS.SELECT)
  const [items, setItem] = useState<any[]>([])
  const isPainting = useRef(false)
  const currentShapeId = useRef<String>("")
  const [selectedItem, setSelectedItem] = useState()


  const onPointerUp = () => {
    isPainting.current = false
    setAction(ACTIONS.SELECT)
  }

  const onPointerDown = () => {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current
    const { x, y } = stage?.getPointerPosition()!
    const id = uuidv4()

    currentShapeId.current = id
    isPainting.current = true

    switch (action) {
      case ACTIONS.ADD:
        setItem((items) => [...items, {
          id,
          x,
          y,
          height: 20,
          width: 20,
        }])
        break;
      case ACTIONS.MOVE:
        console.log("hei")
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

    const stage = e.target.getStage()
    const pointerPosition = stage.getPointerPosition()

    setSelectedItem(target)


  }

  const exportCanvas = () => {

  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-0 z-10 w-full py-2">
        <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg">
          <button onClick={() => setAction(ACTIONS.SELECT)} className={action === ACTIONS.SELECT ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
            <ArrowsPointingInIcon className="size-5"></ArrowsPointingInIcon>
          </button>

          <button onClick={() => setAction(ACTIONS.ADD)} className={action === ACTIONS.ADD ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
            <PlusIcon className="size-5"></PlusIcon>
          </button>

          <button onClick={() => setAction(ACTIONS.SCRIBBLE)} className={action === ACTIONS.SCRIBBLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
            <ItalicIcon className="size-5"></ItalicIcon>
          </button>

          <button onClick={() => stageRef.current.destroyChildren} className="p-1 rounded hover:bg-violet-100" >
            <XMarkIcon className="size-5"></XMarkIcon>
          </button>

          <button onClick={exportCanvas} className="p-1 rounded hover:bg-violet-100" >
            <ArrowDownTrayIcon className="size-5"></ArrowDownTrayIcon>
          </button>
        </div>
      </div>

      <ContextMenu>
        <ContextMenuTrigger>
          <Stage ref={stageRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} className="border-blue-50" width={window.innerWidth} height={window.innerHeight}>
            <Layer>
              <Rect onClick={() => { transformerRef.current?.nodes([]) }} x={0} y={0} height={window.innerHeight} width={window.innerWidth} fill="white" stroke="black" strokeWidth={4} id="bg" />

              {items.map((item) => (
                <Rect onContextMenu={(e) => { setSelectedItem(e.target.id()) }} draggable key={item.id} x={item.x} y={item.y} stroke="black" strokeWidth={2} fill="red" height={item.height} width={item.width} onClick={onClick}
                />
              ))}
              <Transformer ref={transformerRef} />
            </Layer>
          </Stage>
        </ContextMenuTrigger>
        {selectedItem ? (
          <ContextMenuContent className="w-64">
            <ContextMenuItem>Hei Ala</ContextMenuItem>
          </ContextMenuContent>
        ) : null}
      </ContextMenu>
    </div>
  )
}

export default DiagramPage
