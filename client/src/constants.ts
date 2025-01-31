export const ACTIONS = {
  SELECT: "SELECT",
  SCRIBBLE: "SCRIBBLE",
  ADD: "ADD",
  MOVE: "MOVE",
  CONNECTOR: "CONNECTOR",
  DOWNLOAD: "DOWNLOAD"
}

export const STATE = {
  MOVING: false,
  IDLE: false,
}

export const COMPONENTS = [
  {
    value: "compressor",
    label: "Compressor",
    img: "compressor.png"
  },
  {
    value: "condensator",
    label: "Condensator",
    img: "condevap.png"
  },
  {
    value: "evaporator",
    label: "Evaporator",
    img: "condevap.png"
  },
]
