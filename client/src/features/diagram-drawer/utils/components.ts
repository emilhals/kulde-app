export const COMPONENTS = [
  {
    value: 'compressor',
    label: 'Compressor',
    width: 96,
    height: 96,
    anchors: {
      position: ['Right', 'Left'],
    },
  },
  {
    value: 'heatexchanger',
    label: 'Heat Exchanger',
    width: 128,
    height: 96,
    anchors: {
      position: ['Right', 'Left'],
    },
  },
  {
    value: 'tev',
    label: 'Thermostatic Expansion Valve',
    width: 156,
    height: 124,
    anchors: {
      position: ['Right', 'Left'],
      offset: {
        y: 'Bottom',
      },
    },
  },
  {
    value: 'liquidfilter',
    label: 'Liquid Filter',
    width: 32,
    height: 56,
    anchors: {
      position: ['Top', 'Bottom'],
    },
  },
  {
    value: 'pressureswitch',
    label: 'Pressure Switch',
    width: 64,
    height: 64,
  },
  {
    value: 'sightglass',
    label: 'Sight Glass',
    width: 24,
    height: 48,
    anchors: {
      position: ['Top', 'Bottom'],
    },
  },
  {
    value: 'measurepoint_t',
    label: 'Measure point - Temperature',
    width: 24,
    height: 24,
    anchors: {
      position: ['Top', 'Bottom', 'Right', 'Left'],
    },
  },
  {
    value: 'measurepoint_p',
    label: 'Measure point - Pressure',
    width: 24,
    height: 24,
    anchors: {
      position: ['Top', 'Bottom', 'Right', 'Left'],
    },
  },
]
