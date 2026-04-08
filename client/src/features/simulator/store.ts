import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'

type ParameterType = {
    value: number
    editable: boolean
}

type ControllerState = {
    view: 'DISPLAY' | 'EDIT'
    parameters: Record<string, ParameterType>
}

export const flatParams = ({
    controllerSnap,
}: {
    controllerSnap: ControllerState
}) => {
    return Object.fromEntries(
        Object.entries(controllerSnap.parameters).map(([key, param]) => [
            key,
            param.value,
        ]),
    )
}

export const initialControllerState: ControllerState = {
    view: 'DISPLAY',
    parameters: {
        u56: {
            value: 24,
            editable: false,
        },
        setPoint: {
            value: 4,
            editable: true,
        },
        r01: {
            value: 4,
            editable: true,
        },
        r12: {
            value: 1,
            editable: true,
        },
    },
}

export const controllerState = proxy(deepClone(initialControllerState))
