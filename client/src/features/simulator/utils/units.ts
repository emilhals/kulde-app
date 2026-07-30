import { uiState } from '../stores/ui'
import { Unit } from '../types'

export const getUnitSymbol = (unit: Unit) => {
  switch (unit) {
    case 'percentage':
      return '%'
    case 'kelvin':
      return 'K'
    case 'pressure':
      return uiState.units.pressure
    case 'temperature':
      return getTemperatureUnitSymbol()
  }
}

export const getTemperatureUnitSymbol = () => {
  switch (uiState.units.temperature) {
    case 'celsius':
      return '°C'
    case 'fahrenheit':
      return '°F'
  }
}
