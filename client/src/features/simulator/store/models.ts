import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'

export type ParameterType = {
	value: number
	max?: number
	min?: number
	function: string
}

export type ControllerState = {
	setPoint: Omit<ParameterType, 'function'>
	parameters: Record<string, ParameterType>
}

export type SetPoint = Omit<ParameterType, 'function'>
export type ParamKey = keyof ControllerState['parameters']

export const paramKeys: ParamKey[] = [
	'r01',
	'r02',
	'r03',
	'r05',
	'r12',
	'd01',
	'd02',
	'd03',
	'd04',
]

export const initialControllerState: ControllerState = {
	setPoint: { value: 4 },
	parameters: {
		r01: { value: 4, function: 'Differential' },
		r02: { value: 12, function: 'Max cutout' },
		r03: { value: -6, function: 'Min cutout' },
		r05: { value: 0, function: 'Temperature Unit', max: 1, min: 0 },
		r12: { value: 1, function: 'Internal Main Switch', max: 1, min: 0 },
		d01: { value: 2, function: 'Defrost Method' },
		d02: { value: 10, function: 'Defrost Stop Temperature' },
		d03: { value: 8, function: 'Hours between each Defrost' },
		d04: { value: 45, function: 'Max Defrost Time (minutes)' },
	},
}

export const controllerState = proxy(deepClone(initialControllerState))
