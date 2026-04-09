import { Item, ItemPreview } from '@/features/diagram-drawer/types'
import { Arc, Group, Line, Rect } from 'react-konva'

const Accumulator = ({ item }: { item: Item | ItemPreview }) => {
    if (!item) return null

    const w = item.width
    const h = item.height
    const rx = w / 2
    const domeH = rx // dome height equals the radius for a perfect semicircle

    // body runs between the two dome bases
    const bodyTop = domeH
    const bodyBottom = h - domeH

    return (
        <Group>
            {/* Main cylindrical body */}
            <Rect
                name="object"
                x={0}
                y={bodyTop}
                width={w}
                height={bodyBottom - bodyTop}
                stroke="black"
                strokeWidth={1.5}
            />
            {/* Top dome — sits above body, peak at y=0 */}
            <Arc
                name="object"
                x={rx}
                y={bodyTop}
                innerRadius={0}
                outerRadius={rx}
                angle={180}
                rotation={180}
                stroke="black"
                strokeWidth={1.5}
                fill="white"
            />
            {/* Bottom dome — sits below body, base at y=h */}
            <Arc
                name="object"
                x={rx}
                y={bodyBottom}
                innerRadius={0}
                outerRadius={rx}
                angle={180}
                rotation={0}
                stroke="black"
                strokeWidth={1.5}
                fill="white"
            />
            {/* U-tube — stays within body bounds */}
            <Line
                points={[
                    rx - w * 0.15,
                    bodyTop + 8,
                    rx - w * 0.15,
                    bodyBottom - 16,
                    rx + w * 0.15,
                    bodyBottom - 16,
                    rx + w * 0.15,
                    bodyTop + 8,
                ]}
                stroke="black"
                strokeWidth={1.5}
                lineCap="round"
                lineJoin="round"
            />
        </Group>
    )
}
export default Accumulator
