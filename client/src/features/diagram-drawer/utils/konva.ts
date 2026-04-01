import { Rect } from '@/features/diagram-drawer/types'
import Konva from 'konva'

export const dragBounds = (ref: React.RefObject<Konva.Circle>) => {
    if (ref.current !== null) {
        return ref.current.getAbsolutePosition()
    }
    return { x: 0, y: 0 }
}

export const intersected = (selection: Rect, item: Rect): boolean => {
    return (
        selection.left < item.right &&
        selection.right > item.left &&
        selection.top < item.bottom &&
        selection.bottom > item.top
    )
}
