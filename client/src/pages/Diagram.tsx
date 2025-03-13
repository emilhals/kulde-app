import { Stage, Layer, Transformer } from "react-konva"
import Konva from "konva"
import { useEffect, useRef, useState, useContext } from 'react'

import { useSnapshot } from "valtio"

import { store } from "@/store"

import { ACTIONS } from '@/common/constants'

import { Text } from '@/components/diagram/Text'
import { Item } from '@/components/diagram/Item'
import { Connector } from '@/components/diagram/Connector'
import { Actionbar } from '@/components/diagram/Actionbar'
import { Selection } from "@/components/diagram/Selection"

import { useCustomFont } from "@/hooks/useCustomFont"

import { ActionContext } from '@/common/Providers'

const DiagramPage = () => {
  /* konva related */
  const stageRef = useRef<Konva.Stage>(null)
  const [size, setSize] = useState({ width: window.innerWidth, height: 900 })

  const transformerRef = useRef<Konva.Transformer>(null)

  /* ui related */
  const containerRef = useRef<HTMLDivElement>(null)
  const [fontLoaded] = useCustomFont('Open Sans:300,500')
  const itemLayer = useRef<Konva.Layer>(null)


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

  return (
    <div ref={containerRef} className="flex flex-col">
      <div className="grow">
        <Actionbar />
        <Stage
          style={{
            width: '100%', border: '1px solid black',
            backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '16px 16px'
          }}
          ref={stageRef} width={stageWidth} height={stageHeight}>

          {actionContext?.action === ACTIONS.SELECT && (
            <Selection stageRef={stageRef} transformerRef={transformerRef} />
          )}


          <Layer ref={itemLayer}>
            {snap.items
              .map((item, index) => {
                return (
                  <Item key={index} item={item} />
                )
              }
              )}


            {snap.lines
              .map((line, index) => {
                return (
                  <Line stageRef={stageRef} layerRef={itemLayer} />
                )
              })}


            {snap.texts
              .map((text, index) => {
                return (
                  <Text key={index} parent={text} />
                )
              })}

            <Transformer ref={transformerRef} />
          </Layer>

          {actionContext?.action === ACTIONS.CONNECTOR && (
            <Connector stageRef={stageRef} layerRef={itemLayer} />
          )}

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
