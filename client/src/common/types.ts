export type Point = {
  x: number;
  y: number;
};

export type Line = {
  id: string;
  fromObject: ItemType;
  mid: Point;
  toObject: ItemType;
  complete: Boolean;
  fromPointsOffset: Point;
  toPointsOffset: Point;
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
  lines: Line[];
}

