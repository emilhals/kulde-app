import type { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Group, Line, Rect, RegularPolygon } from 'react-konva'

const SolenoidValve = ({ item }: { item: Item | ItemPreview }) => {
    if (!item) return null

    const w = item.width
    const h = item.height
    const cx = w / 2
    const valveY = h * 0.55
    const triR = Math.min(w, h * 0.45) * 0.5
    const coilH = h * 0.28
    const coilW = w * 0.55

    const itemId = 'id' in item ? item.id : ''

    return (
        <Group id={itemId}>
            {/* Solenoid coil rectangle on top */}
            <Rect
                name="object"
                x={cx - coilW / 2}
                y={h * 0.05}
                width={coilW}
                height={coilH}
                stroke="black"
                strokeWidth={2}
            />
            {/* Line connecting coil to valve body */}
            <Line
                points={[cx, h * 0.05 + coilH, cx, valveY - triR]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            {/* Left triangle (pointing right) */}
            <RegularPolygon
                name="object"
                sides={3}
                radius={triR}
                rotation={90}
                x={cx - triR}
                y={valveY}
                stroke="black"
                strokeWidth={2}
                fill="white"
            />
            {/* Right triangle (pointing left) */}
            <RegularPolygon
                name="object"
                sides={3}
                radius={triR}
                rotation={-90}
                x={cx + triR}
                y={valveY}
                stroke="black"
                strokeWidth={2}
                fill="white"
            />
            {/* Inlet line left */}
            <Line
                points={[0, valveY, cx - triR * 2, valveY]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
            {/* Outlet line right */}
            <Line
                points={[cx + triR * 2, valveY, w, valveY]}
                stroke="black"
                strokeWidth={2}
                lineCap="round"
            />
        </Group>
    )
}

export default SolenoidValve
