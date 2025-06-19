export type PlacementType = 'top' | 'bottom' | 'right' | 'left'

export type PointType = {
  x: number;
  y: number;
};

export type OffsetType = {
  placement: PlacementType;
  position: PointType;
}

export type ConnectionPreview = Omit<ConnectionType, 'id'>
export type ConnectionType = {
  readonly id: string;
  readonly type: 'connections';
  from: ItemType;
  to: ItemType;
  points: [];
  offsets: {
    from: OffsetType;
    to: OffsetType;
  }
};

export type SelectionType = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

export type ItemPreview = Omit<ItemType, "id">
export type ItemType = {
  readonly id: string;
  readonly type: 'items';
  component: string;
  height: number;
  width: number;
  x: number;
  y: number;
  locked: boolean;
  img: string;
  text: TextType;
}

export type TextPreview = Omit<TextType, 'id'>
export type TextType = {
  readonly id: string;
  readonly type: 'texts';
  content: string;
  position: PointType;
  size: number;
  attributes?: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }
}

export type ComponentType = {
  value: string;
  img: string;
  label: string;
  width: number;
  height: number;
}
