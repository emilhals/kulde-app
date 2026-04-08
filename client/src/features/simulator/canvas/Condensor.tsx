import React, { useState, useEffect } from 'react'
import { Shape, Layer, Rect, Line, Circle, Group, Text, Arc } from 'react-konva'

const Condenser = () => {
  const [fanRotation, setFanRotation] = useState(0)
  const [airflow, setAirflow] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFanRotation((prev) => (prev + 5) % 360)
      setAirflow((prev) => (prev + 2) % 100)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const coilPaths = [
    { y: 80, color: '#D32F2F' },
    { y: 140, color: '#E64A19' },
    { y: 200, color: '#F57C00' },
    { y: 260, color: '#FFA726' },
  ]

  const drawCoilRow = (startX, startY, color, direction = 'right') => {
    const loopHeight = 30
    const loopWidth = 50
    const numLoops = 4

    return (
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath()
          context.moveTo(startX, startY)

          for (let i = 0; i < numLoops; i++) {
            const x = startX + i * loopWidth

            if (direction === 'right') {
              // Top arc
              context.bezierCurveTo(
                x + 10,
                startY - loopHeight,
                x + loopWidth - 10,
                startY - loopHeight,
                x + loopWidth,
                startY,
              )
              // Bottom arc
              context.bezierCurveTo(
                x + loopWidth - 10,
                startY + loopHeight,
                x + 10,
                startY + loopHeight,
                x,
                startY,
              )
            }
          }

          context.lineTo(startX + numLoops * loopWidth, startY)

          context.strokeShape(shape)
        }}
        stroke={color}
        strokeWidth={12}
        lineCap="round"
        lineJoin="round"
      />
    )
  }
  const drawCoilWithFins = () => {
    const coils = [
      { y: 80, color: '#C62828', endColor: '#C62828' },
      { y: 130, color: '#D84315', endColor: '#E64A19' },
      { y: 180, color: '#EF6C00', endColor: '#F57C00' },
      { y: 230, color: '#FB8C00', endColor: '#FFA726' },
      { y: 280, color: '#FFA726', endColor: '#FFB74D' },
    ]

    const finPositions = [70, 110, 150, 190, 230]

    return (
      <Group>
        {/* Vertical fins */}
        {finPositions.map((x, idx) => (
          <Line
            key={`fin-${idx}`}
            points={[x, 65, x, 295]}
            stroke="#8D6E63"
            strokeWidth={2}
            opacity={0.6}
          />
        ))}

        {/* Horizontal coil tubes */}
        {coils.map((coil, idx) => (
          <Group key={`coil-${idx}`}>
            {/* Main horizontal tube */}
            <Line
              points={[40, coil.y, 250, coil.y]}
              stroke={coil.color}
              strokeWidth={14}
              lineCap="round"
            />

            {/* Left turn (inlet side) */}
            <Circle
              x={40}
              y={coil.y}
              radius={20}
              stroke={coil.color}
              strokeWidth={14}
              fill="transparent"
              rotation={-90}
            />

            {/* Right turn (outlet side) */}
            <Circle
              x={250}
              y={coil.y}
              radius={20}
              stroke={coil.endColor}
              strokeWidth={14}
              fill="transparent"
              rotation={90}
            />

            {/* Connector to next coil */}
            {idx < coils.length - 1 && (
              <Line
                points={[250, coil.y, 250, coils[idx + 1].y]}
                stroke={coil.endColor}
                strokeWidth={14}
                lineCap="round"
              />
            )}
          </Group>
        ))}

        {/* Inlet connection */}
        <Line
          points={[40, 60, 40, 80]}
          stroke="#C62828"
          strokeWidth={14}
          lineCap="round"
        />

        {/* Outlet connection */}
        <Line
          points={[250, 280, 250, 300]}
          stroke="#FFB74D"
          strokeWidth={14}
          lineCap="round"
        />
      </Group>
    )
  }
  const drawSerpentineCoil = (startX, startY) => {
    const rows = [
      { offset: 0, color: '#C62828' },
      { offset: 50, color: '#D84315' },
      { offset: 100, color: '#EF6C00' },
      { offset: 150, color: '#F57C00' },
      { offset: 200, color: '#FB8C00' },
    ]

    return (
      <Group>
        {rows.map((row, idx) => (
          <Group key={idx}>
            <Shape
              sceneFunc={(context, shape) => {
                const y = startY + row.offset
                const loopHeight = 25
                const loopWidth = 50
                const numLoops = 4

                context.beginPath()
                context.moveTo(startX, y)

                for (let i = 0; i < numLoops; i++) {
                  const x = startX + i * loopWidth

                  // Upper loop
                  context.bezierCurveTo(
                    x + 12,
                    y - loopHeight,
                    x + loopWidth - 12,
                    y - loopHeight,
                    x + loopWidth,
                    y,
                  )
                  // Lower loop
                  context.bezierCurveTo(
                    x + loopWidth - 12,
                    y + loopHeight,
                    x + 12,
                    y + loopHeight,
                    x,
                    y,
                  )
                }

                context.lineTo(startX + numLoops * loopWidth, y)
                context.strokeShape(shape)
              }}
              stroke={row.color}
              strokeWidth={12}
              lineCap="round"
              lineJoin="round"
            />

            {/* Connector to next row */}
            {idx < rows.length - 1 && (
              <Line
                points={[
                  startX + 200,
                  startY + row.offset,
                  startX + 200,
                  startY + rows[idx + 1].offset,
                ]}
                stroke={row.color}
                strokeWidth={12}
                lineCap="round"
              />
            )}
          </Group>
        ))}
      </Group>
    )
  }
  return (
    <Group x={300}>
      {/* Main housing */}
      <Rect
        x={20}
        y={20}
        width={400}
        height={340}
        fill="#E8D7B8"
        stroke="#8B7355"
        strokeWidth={3}
        cornerRadius={5}
      />

      {/* Coils */}
      {drawCoilWithFins()}
      {/* Inlet pipe */}
      <Line
        points={[20, 80, 50, 80]}
        stroke="#1976D2"
        strokeWidth={8}
        lineCap="round"
      />
      <Text
        x={5}
        y={60}
        text="IN"
        fontSize={12}
        fill="#1976D2"
        fontStyle="bold"
      />

      {/* Outlet pipe */}
      <Line
        points={[370, 260, 420, 260]}
        stroke="#FDD835"
        strokeWidth={8}
        lineCap="round"
      />
      <Text
        x={425}
        y={255}
        text="OUT"
        fontSize={12}
        fill="#FDD835"
        fontStyle="bold"
      />

      {/* Fan housing */}
      <Circle
        x={500}
        y={200}
        radius={60}
        fill="#ECEFF1"
        stroke="#37474F"
        strokeWidth={3}
      />

      {/* Fan blades */}
      <Group x={500} y={200} rotation={fanRotation}>
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <Group key={i} rotation={angle}>
            <Line
              points={[0, 0, 0, -45]}
              stroke="#455A64"
              strokeWidth={6}
              lineCap="round"
            />
            <Line
              points={[0, -30, -8, -40]}
              stroke="#455A64"
              strokeWidth={4}
              lineCap="round"
            />
          </Group>
        ))}

        {/* Fan center */}
        <Circle x={0} y={0} radius={10} fill="#263238" />
      </Group>

      {/* Airflow indicators */}
    </Group>
  )
}

export default Condenser
