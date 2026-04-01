export type Placement = 'Top' | 'Bottom' | 'Right' | 'Left'

export type ComponentContext = 'Panel' | 'Diagram'

export type WithId<T> = T & { id: string }

export type PointType = {
    x: number
    y: number
}

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
    position: PointType
}

export type Attachment = ItemAttachment | ConnectionAttachment | FreeAttachment

export type ConnectionPreview = Omit<ConnectionType, 'id'>
export type ConnectionType = {
    readonly type: 'connections'
    readonly id: string

    from: Attachment
    to: Attachment
}

export type Box = {
    start: PointType
    end: PointType
}

export type Rect = {
    left: number
    right: number
    top: number
    bottom: number
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
        position: readonly Placement[]
        offset?: {
            x?: Placement
            y?: Placement
        }
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
    attributes?: readonly string[]
    anchor?: {
        type: 'item'
        itemId: string
        placement: Placement
        offset: PointType
    }
}

export type ComponentType = {
    value: string
    img: string
    label: string
    width: number
    height: number
    anchors: {
        position: Placement[]
        offset?: {
            x?: Placement
            y?: Placement
        }
    }
}
