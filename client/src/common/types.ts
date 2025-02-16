export type PointType = {
  x: number;
  y: number;
};

export type LineType = {
  id: string;
  fromObject: ItemType;
  mid: PointType;
  toObject: ItemType;
  complete: Boolean;
  fromPointsOffset: PointType;
  toPointsOffset: PointType;
};

export type SelectionType = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  show: boolean;
}

export type ItemType = {
  id: string;
  type: string;
  label: string;
  height: number;
  width: number;
  x: number;
  y: number;
  textXOffset: number;
  textYOffset: number;
  img: string;
  lines: LineType[];
}

