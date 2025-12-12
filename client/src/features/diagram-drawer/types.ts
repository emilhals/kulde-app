export type PlacementType = 'Top' | 'Bottom' | 'Right' | 'Left' | null
export type ComponentContext = 'Panel' | 'Diagram'

export type WithId<T> = T & { id: string }

export type PointType = {
  x: number
  y: number
}

export type OffsetType = {
  placement: PlacementType
  position: PointType
}

export type ConnectionPreview = Omit<ConnectionType, 'id'>
export type ConnectionType = {
  readonly type: 'connections'
  readonly id: string
  from: ItemType | null
  to: ItemType | null
  points: []
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
    position: PlacementType[]
    offset: {
      x: PlacementType
      y: PlacementType
    }
  }
  locked: boolean
  text: TextType
}

export type TextPreview = Omit<TextType, 'id'>
export type TextType = {
  readonly type: 'texts'
  readonly id: string
  content: string
  position: PointType
  size: number
  attributes?: string[]
}

export type ComponentType = {
  value: string
  img: string
  label: string
  width: number
  height: number
  anchors: PlacementType
}
