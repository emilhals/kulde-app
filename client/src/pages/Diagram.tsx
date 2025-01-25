import { Stage, Layer, Rect } from "react-konva"
import Konva from "konva"
import { useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { ArrowUpLeftIcon } from '@heroicons/react/24/solid'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'
import { PencilIcon } from "@heroicons/react/24/solid"
import { PlusIcon } from "@heroicons/react/24/solid"

import { ACTIONS } from "../constants"


function DiagramPage() {
  const stageRef = useRef<Konva.Stage>(null)
  const [action, setAction] = useState(ACTIONS.SELECT)

  const [items, setItem] = useState([])
  const isPainting = useRef(false)
  const currentShapeId = useRef<String>("")


  const onPointerUp = () => {
    isPainting.current = false
  }

  const onPointerDown = () => {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current
    const { x, y } = stage.getPointerPosition()
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
    }

  }

  const onPointerMove = () => {
    if (action === ACTIONS.SELECT || !isPainting.current) return;

    const stage = stageRef.current
    const { x, y } = stage.getPointerPosition()


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

  const exportCanvas = () => {

  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute top-0 z-10 w-full py-2">
        <div className="flex justify-center items-center gap-3 py-2 px-3 w-fit mx-auto border shadow-lg rounded-lg">
          <button onClick={() => setAction(ACTIONS.SELECT)} className={action === ACTIONS.SELECT ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
            <ArrowUpLeftIcon className="size-5"></ArrowUpLeftIcon>
          </button>

          <button onClick={() => setAction(ACTIONS.ADD)} className={action === ACTIONS.ADD ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
            <PlusIcon className="size-5"></PlusIcon>
          </button>

          <button onClick={() => setAction(ACTIONS.SCRIBBLE)} className={action === ACTIONS.SCRIBBLE ? "bg-violet-300 p-1 rounded" : "p-1 hover:bg-violet-100 rounded"}>
            <PencilIcon className="size-5"></PencilIcon>
          </button>

          <button onClick={exportCanvas} className="p-1 rounded hover:bg-violet-100" >
            <ArrowDownTrayIcon className="size-5"></ArrowDownTrayIcon>
          </button>
        </div>
      </div>
      <Stage ref={stageRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} className="border-blue-50" width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect x={0} y={0} height={window.innerHeight} width={window.innerWidth} fill="white" stroke="black" strokeWidth={4} id="bg" />

          {items.map((item) => (
            <Rect key={item.id} x={item.x} y={item.y} stroke="black" strokeWidth={2} fill="red" height={item.height} width={item.width}

            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default DiagramPage
