export type Placement = 'Top' | 'Bottom' | 'Right' | 'Left'

export type ComponentContext = 'Panel' | 'Diagram'

export type SymbolName =
    | 'compressor'
    | 'heatexchanger'
    | 'tev'
    | 'liquidfilter'
    | 'pressureswitch'
    | 'sightglass'
    | 'oilseparator'
    | 'accumulator'
    | 'receiver'
    | 'solenoidvalve'
    | 'checkvalve'
    | 'ballvalve'
    | 'pressuregauge'
    | 'thermometer'
    | 'levelindicator'
    | 'flowmeter'

export type WithId<T> = T & { id: string }
export type WithoutId<T> = Omit<T, 'id'>

export type Point = {
    x: number
    y: number
}

export type Attachment = ItemAttachment | ConnectionAttachment | FreeAttachment

export type ItemAttachment = {
    type: 'item'
    itemId: string
    placement: Placement
    t: number
}

export type ConnectionAttachment = {
    type: 'connection'
    connectionId: string
    segmentIndex: number
    t: number
}

export type FreeAttachment = {
    type: 'free'
    position: Point
}

export type Connection = {
    readonly type: 'connections'
    readonly id: string

    from: Attachment
    to: Attachment
}

export type Box = {
    start: Point
    end: Point
}

export type Rect = {
    left: number
    right: number
    top: number
    bottom: number
}

export type Item = {
    readonly type: 'items'
    readonly id: string
    component: SymbolName
    height: number
    width: number
    x: number
    y: number
    locked: boolean
    anchors: {
        position: readonly Placement[]
        offsets?: Partial<Record<Placement, Point>>
    }
}

export type ItemPreview = {
    component: SymbolName
    label: string
    width: number
    height: number
    x?: number
    y?: number
    anchors: {
        position: readonly Placement[]
        offsets?: Partial<Record<Placement, Point>>
    }
}

export type Text = {
    readonly type: 'texts'
    readonly id: string
    content: string
    position: Point
    size: number
    attributes?: readonly string[]
    anchor?: {
        type: 'item'
        itemId: string
        placement: Placement
        offset: Point
    }
}
