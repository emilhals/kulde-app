import type { Edge, SnapPoint } from '@/features/diagram-drawer/types'

export const useSnapToItem = () => {
    const snap = (
        geometry: {
            edges: Edge[]
            position: number
        },
        guides: number[],
        snapState: { in: number; out: number },
    ): SnapPoint | null => {
        let minDistance = Infinity
        let snapPoint: SnapPoint | null = null

        geometry.edges.forEach((edge) => {
            for (const guide of guides) {
                const distance = Math.abs(guide - edge.value)

                if (distance < minDistance && distance <= snapState.in) {
                    minDistance = distance
                    snapPoint = {
                        alignment: edge.alignment,
                        guide: guide,
                        position: guide - (edge.value - geometry.position),
                    }
                }
            }
        })

        if (snapPoint) {
            return snapPoint
        }

        return null
    }

    return {
        snap,
    }
}
