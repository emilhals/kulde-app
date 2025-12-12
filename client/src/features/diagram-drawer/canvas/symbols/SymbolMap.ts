import Compressor from './Compressor'
import SightGlass from './SightGlass'
import PressureSwitch from './PressureSwitch'
import MeasurePoint from './MeasurePoint'
import HeatExchanger from './HeatExchanger'
import LiquidFilter from './LiquidFilter'
import TEV from './TEV'

import { ItemType } from '../../types'

type SymbolName =
  | 'compressor'
  | 'heatexchanger'
  | 'pressureswitch'
  | 'sightglass'
  | 'measurepoint_t'
  | 'measurepoint_p'
  | 'liquidfilter'
  | 'tev'
type SymbolComponent = React.ComponentType<{ item: ItemType }>

export const SYMBOL_MAP: Record<SymbolName, SymbolComponent> = {
  compressor: Compressor,
  heatexchanger: HeatExchanger,
  tev: TEV,
  pressureswitch: PressureSwitch,
  sightglass: SightGlass,
  measurepoint_t: MeasurePoint,
  measurepoint_p: MeasurePoint,
  liquidfilter: LiquidFilter,
}
