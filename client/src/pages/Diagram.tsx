import { Stage, Layer, Transformer, Line } from 'react-konva'
import Konva from 'konva'
import { useEffect, useRef, useState, useContext } from 'react'

import { useSnapshot } from 'valtio'
import { store } from '@/store'

import { ACTIONS } from '@/common/constants'

import { Text } from '@/components/diagram/Text'
import { Item } from '@/components/diagram/Item'
import { Connector } from '@/components/diagram/Connector'
import { Actionbar } from '@/components/diagram/Actionbar'

import { ActionContext } from '@/common/Providers'
import { useCustomFont } from '@/hooks/useCustomFont'

import { getConnectionPoints } from '@/lib/utils'

const DiagramPage = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemLayer = useRef<Konva.Layer>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const connectorRef = useRef<Konva.Line>(null)

  /* loading the custom font */
  const [,] = useCustomFont('Open Sans')

  const [size, setSize] = useState({ width: window.innerWidth, height: 900 })

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
    <div ref={containerRef} className="flex flex-col dark:bg-dark-bg" onContextMenu={(e) => { e.preventDefault() }}>
      <div className="grow">
        <Actionbar />
        <Stage
          className="w-full border border-black dark:border-gray-700 bg-[radial-gradient(#D9D9D9_1px,transparent_1px)] dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] bg-[length:16px_16px]"
          ref={stageRef}
          width={stageWidth} height={stageHeight}
          onContextMenu={(e) => { e.evt.preventDefault() }}
          context
        >
          <Layer ref={itemLayer}>
            {snap.items
              .map((item, index) => {
                return (
                  <Item key={index} item={item} />
                )
              }
              )}

            {snap.connections
              .map((connection, index) => {
                const points = getConnectionPoints(connection.from, connection.to, connection)
                return (
                  <Line
                    key={index}
                    x={connection.from.x + connection.offsets.from.x}
                    y={connection.from.y + connection.offsets.from.y}
                    ref={connectorRef}
                    points={points}
                    stroke="black"
                    strokeWidth={2}
                  />
                )
              })}

            {snap.texts
              .map((text, index) => {
                return (
                  <Text key={index} parent={text} standalone={true} />
                )
              })}

            <Transformer ref={transformerRef} />
          </Layer>

          {actionContext?.action === ACTIONS.CONNECTOR && (
            <Connector stageRef={stageRef} layerRef={itemLayer} />
          )}

        </Stage>
      </div>

      <div className="h-32 grow-0 bg-gray-50 dark:bg-dark-bg">
        <h3>Components:</h3>
        <div className="flex-row">
          <div className="basis-1/4">
            {snap.items
              .map((item, index) => {
                return (
                  <ul key={index}>
                    <li>{item.id} - {item.text.text}</li>
                    <li>x: {item.x} | y: {item.y}</li>
                  </ul>
                )
              }
              )}
          </div>

          <div className="basis-1/4">
            {snap.texts
              .map((text, index) => {
                return (
                  <ul key={index}>
                    <li>{text.id} - {text.text}</li>
                    <li>x: {text.x} | y: {text.y}</li>
                  </ul>
                )
              }
              )}
          </div>

          <div className="basis-1/4">
            {snap.connections
              .map((connection, index) => {
                return (
                  <ul key={index}>
                    <li>{connection.id}</li>
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
