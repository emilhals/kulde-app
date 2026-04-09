import Accumulator from '@/features/diagram-drawer/canvas/symbols/Accumulator'
import Compressor from '@/features/diagram-drawer/canvas/symbols/Compressor'
import FlowMeter from '@/features/diagram-drawer/canvas/symbols/FlowMeter'
import HeatExchanger from '@/features/diagram-drawer/canvas/symbols/HeatExchanger'
import LevelIndicator from '@/features/diagram-drawer/canvas/symbols/LevelIndicator'
import LiquidFilter from '@/features/diagram-drawer/canvas/symbols/LiquidFilter'
import OilSeparator from '@/features/diagram-drawer/canvas/symbols/OilSeparator'
import PressureGauge from '@/features/diagram-drawer/canvas/symbols/PressureGauge'
import PressureSwitch from '@/features/diagram-drawer/canvas/symbols/PressureSwitch'
import Receiver from '@/features/diagram-drawer/canvas/symbols/Receiver'
import SightGlass from '@/features/diagram-drawer/canvas/symbols/SightGlass'
import TEV from '@/features/diagram-drawer/canvas/symbols/TEV'
import Thermometer from '@/features/diagram-drawer/canvas/symbols/Thermometer'
import BallValve from '@/features/diagram-drawer/canvas/symbols/valves/BallValve'
import CheckValve from '@/features/diagram-drawer/canvas/symbols/valves/CheckValve'
import SolenoidValve from '@/features/diagram-drawer/canvas/symbols/valves/SolenoidValve'
import { Item, ItemPreview, SymbolName } from '@/features/diagram-drawer/types'

export type SymbolComponent = React.ComponentType<{ item: Item | ItemPreview }>

export const SYMBOL_MAP: Record<SymbolName, SymbolComponent> = {
    compressor: Compressor,
    heatexchanger: HeatExchanger,
    tev: TEV,
    pressureswitch: PressureSwitch,
    sightglass: SightGlass,
    liquidfilter: LiquidFilter,
    oilseparator: OilSeparator,
    accumulator: Accumulator,
    receiver: Receiver,
    solenoidvalve: SolenoidValve,
    checkvalve: CheckValve,
    ballvalve: BallValve,
    pressuregauge: PressureGauge,
    thermometer: Thermometer,
    levelindicator: LevelIndicator,
    flowmeter: FlowMeter,
}
