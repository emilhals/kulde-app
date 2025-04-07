import { useEffect, useRef, useState } from 'react'

import { Stage, Layer } from 'react-konva'
import { Html } from 'react-konva-utils'
import Konva from 'konva'

import { useSnapshot } from 'valtio'
import { store } from '@/store'


import { Text } from '@/components/diagram/Text'
import { Item } from '@/components/diagram/Item'
import { Connector } from '@/components/diagram/Connector'
import { Line } from '@/components/diagram/Line'
import { Create } from '@/components/diagram/Create'

import { useCustomFont } from '@/hooks/useCustomFont'

import { getConnectionPoints } from '@/lib/utils'
import { KonvaEventObject } from 'konva/lib/Node'
import { Toolbar } from '@/components/diagram/Toolbar'

const DiagramPage = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemLayer = useRef<Konva.Layer>(null)
  const connectorRef = useRef<Konva.Line>(null)

  /* loading the custom font */
  const [,] = useCustomFont('Open Sans')

  const [stage, setStage] = useState({ width: 0, height: 0, scale: 1 })

  const snap = useSnapshot(store)

  /* set stage size and ensure responsiveness  */
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return
      const { clientWidth, clientHeight } = containerRef.current
      setStage({
        scale: 1,
        width: clientWidth,
        height: clientHeight
      })
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const handleClick = (e: KonvaEventObject<Konva.KonvaPointerEvent>) => {
    if (!e.target.id())
      store.selected = null
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.button === 1) {
      console.log('hei')
      e.preventDefault()
    }
  }



  return (
    <div ref={containerRef} className='h-full' onAuxClick={handleMove} onContextMenu={(e) => { e.preventDefault() }}>
      <Create />
      <Toolbar stage={stageRef} />
      <Stage
        className="w-full z-10 bg-[radial-gradient(#D9D9D9_1px,transparent_1px)] dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] bg-[length:16px_16px]"
        ref={stageRef}
        width={stage.width}
        height={stage.height}
        scaleX={stage.scale}
        scaleY={stage.scale}
        onContextMenu={(e) => { e.evt.preventDefault() }}
        onClick={handleClick}
      >

        <Layer ref={itemLayer}>
          {snap.items
            .map((item) => {
              return (
                <Item key={item.id} item={item} />
              )
            }
            )}

          {snap.connections
            .map((connection) => {
              return (
                <Line key={connection.id} connection={connection} />
              )
            })}

          {snap.texts
            .map((text) => {
              return (
                <Text key={text.id} parent={text} standalone={true} />
              )
            })}

        </Layer>

        <Connector stageRef={stageRef} selected={snap.selected} />
      </Stage>
    </div>
  )
}

export default DiagramPage
