import { ACTIONS } from "./constants";

export type ActionType = keyof typeof ACTIONS

export type PointType = {
  x: number;
  y: number;
};

export type LineType = {
  id: string;
  from: ItemType;
  mid: PointType;
  to: ItemType;
};

export type SelectionType = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  show: boolean;
  moving: boolean;
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

export type TextType = {
  id: string;
  x: number;
  y: number;
  text: string;
  size: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  independent: boolean;
}
