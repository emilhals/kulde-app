import { ACTIONS } from "./constants";

export type ActionType = keyof typeof ACTIONS


export type PointType = {
  x: number;
  y: number;
};

export type OffsetType = {
  placement: string;
  position: PointType;
}

export type ConnectionPreview = Omit<ConnectionType, 'id'>
export type ConnectionType = {
  id: string;
  type: "connections";
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

export type ItemPreview = Omit<ItemType, 'id'>
export type ItemType = {
  id: string;
  type: "items";
  component: string;
  height: number;
  width: number;
  x: number;
  y: number;
  locked: boolean;
  textOffset: OffsetType;
  text: TextPreview | null;
  img: string;
}


export type TextPreview = Omit<TextType, 'id'>
export type TextType = {
  id: string;
  type: "texts";
  text: string;
  x: number;
  y: number;
  size: number;
  standalone: boolean;
  attributes: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }
}
