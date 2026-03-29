import Konva from 'konva'

export const dragBounds = (ref: React.RefObject<Konva.Circle>) => {
    if (ref.current !== null) {
        return ref.current.getAbsolutePosition()
    }
    return { x: 0, y: 0 }
}
