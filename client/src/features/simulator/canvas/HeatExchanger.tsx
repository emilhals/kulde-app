import { useEffect, useState } from 'react'
import { Line, Rect, Group, Path, Circle, Text } from 'react-konva'
import { CondensatorType, EvaporatorType, PositionType } from '../types'

const HeatExchanger = ({
    data,
    type,
    position,
    flip,
}: {
    data: CondensatorType | EvaporatorType
    type: string
    position: PositionType
    flip?: boolean
}) => {
    const inletPoints = flip ? [260, 0, 210, 0] : [-60, 0, 20, 0]

    const outletPoints = flip ? [-30, 120, 20, 120] : [210, 120, 290, 120]

    const [fanRotation, setFanRotation] = useState(0)
    const [airflow, setAirflow] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setFanRotation((prev) => (prev + data.fan_speed) % 360)
            setAirflow((prev) => (prev + 2) % 100)
        }, 50)
        return () => clearInterval(interval)
    }, [data.fan_speed])

    const drawCoil = () => {
        const numBends = 5

        const startX = 30
        const endX = 220
        const startY = 30

        const spacing = 30
        const coilHeight = (numBends - 1) * spacing
        const colors = [
            '#FF0000', // Hot red
            '#D84315', // Red-orange
            '#EF6C00', // Orange
            '#F57C00', // Light orange
            '#FFA726', // Yellow-orange
        ]

        const colorsFlipped = [
            '#0000FF', // Blue
            '#7040D0', // Purple-blue
            '#00D0FF',
            '#FFA726', // Yellow-orange
        ]

        return [...Array(numBends)].map((_, i) => {
            const y = startY + i * spacing
            const color = flip
                ? colorsFlipped[i] || colorsFlipped[colorsFlipped.length - 1]
                : colors[i] || colors[colors.length - 1]

            return (
                <Group
                    key={i}
                    y={flip == true ? coilHeight + 60 : 0}
                    scaleY={flip == true ? -1 : 1}
                >
                    <Line
                        points={[startX, y, endX, y]}
                        stroke={color}
                        strokeWidth={3}
                        lineCap="round"
                        lineJoin="round"
                    />

                    {i < numBends - 1 && (
                        <Path
                            x={i % 2 === 0 ? endX : startX}
                            y={y + spacing / 2}
                            rotation={i % 2 === 0 ? 0 : 180}
                            stroke={color}
                            strokeWidth={3}
                            lineCap="round"
                            data={`M 0 ${-spacing / 2} A ${spacing / 2} ${spacing / 2} 0 0 1 0 ${spacing / 2}`}
                        />
                    )}
                </Group>
            )
        })
    }

    return (
        <Group x={position.x} y={position.y}>
            <Text text={type} fontFamily="Inter" fontSize={16} x={80} y={-20} />
            <Rect
                width={250}
                height={180}
                fill="#D5D5D5"
                stroke="black"
                strokeWidth={2}
            />

            {/* Line In */}
            <Line
                x={10}
                y={30}
                stroke={flip ? '#FFA276' : '#FF0000'}
                strokeWidth={3}
                points={inletPoints}
                lineCap="round"
                lineJoin="round"
            />

            {/* Line Out */}
            <Line
                x={10}
                y={30}
                stroke={flip ? 'blue' : '#FFA276'}
                strokeWidth={3}
                points={outletPoints}
                lineCap="round"
                lineJoin="round"
            />

            <Circle
                x={125}
                y={90}
                radius={65}
                fill="#ECEFF1"
                stroke="#37474F"
                strokeWidth={4}
            />

            {/* Fan blades */}
            <Group x={125} y={90} rotation={fanRotation}>
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <Group key={i} rotation={angle}>
                        <Line
                            points={[0, 0, 0, -50]}
                            stroke="#263238"
                            strokeWidth={7}
                            lineCap="round"
                        />
                        <Line
                            points={[0, -50, -8, -45]}
                            stroke="#263238"
                            strokeWidth={6}
                            lineCap="round"
                            lineJoin="round"
                        />
                    </Group>
                ))}

                {/* Fan center */}
                <Circle
                    x={0}
                    y={0}
                    radius={12}
                    fill="#263238"
                    stroke="#455A64"
                    strokeWidth={2}
                />
            </Group>
            {drawCoil()}
        </Group>
    )
}

export default HeatExchanger
