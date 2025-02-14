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

