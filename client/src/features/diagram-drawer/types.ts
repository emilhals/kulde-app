export type Placement = 'Top' | 'Bottom' | 'Right' | 'Left'
export type PlacementType = Placement | null

export type ComponentContext = 'Panel' | 'Diagram'

export type WithId<T> = T & { id: string }

export type PointType = {
    x: number
    y: number
}

export type OffsetType = {
    placement: Placement
    position: PointType
}

export type ConnectionPreview = {
    type: 'connections'
    fromId: string
    toId?: string
    offsets: {
        from: OffsetType
        to?: OffsetType
    }
}

export type ConnectionType = {
    readonly type: 'connections'
    readonly id: string
    fromId: string
    toId: string
    points: number[]
    offsets: {
        from: OffsetType
        to: OffsetType
    }
}

export type SelectionType = {
    x1: number
    y1: number
    x2: number
    y2: number
    width: number
    height: number
}

export type ItemPreview = Omit<ItemType, 'id'>
export type ItemType = {
    readonly type: 'items'
    readonly id: string
    component: string
    height: number
    width: number
    x: number
    y: number
    anchors: {
        position: Placement[]
        offset: PointType
    }
    locked: boolean
}

export type TextPreview = Omit<TextType, 'id'>
export type TextType = {
    readonly type: 'texts'
    readonly id: string
    content: string
    position: PointType
    size: number
    attributes?: string[]
    anchor?: {
        type: 'item'
        itemId: string
        placement: PlacementType
        offset: PointType
    }
}

export type ComponentType = {
    value: string
    img: string
    label: string
    width: number
    height: number
    anchors: Placement[]
}
