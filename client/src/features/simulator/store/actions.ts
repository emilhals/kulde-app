import {
	controllerState,
	initialControllerState,
	type ControllerState,
} from '@/features/simulator/store/models'
import { deepClone } from 'valtio/utils'

export const flattenParams = (controllerSnap: ControllerState) => {
	return Object.fromEntries(
		Object.entries(controllerSnap.parameters).map(([key, param]) => [
			key,
			param.value,
		]),
	)
}

export const resetControllerState = () => {
	const fresh = deepClone(initialControllerState)
	Object.keys(controllerState.parameters).forEach(
		(k) => delete controllerState.parameters[k],
	)
	Object.entries(fresh.parameters).forEach(([k, v]) => {
		controllerState.parameters[k] = v
	})
}
