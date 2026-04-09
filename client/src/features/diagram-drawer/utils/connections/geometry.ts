import { Point } from '../../types'

export const toPoints = (pointsFlat: number[]): Point[] => {
    const points = []

    for (let i = 0; i < pointsFlat.length / 2; i++) {
        points.push({
            x: pointsFlat[i * 2],
            y: pointsFlat[i * 2 + 1],
        })
    }
    return points
}

export const interpolateMidPoint = (start: number, end: number): number => {
    return start + (end - start) / 2
}
