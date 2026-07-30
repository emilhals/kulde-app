type ShortcutAction =
  | 'pan-canvas'
  | 'cancel-current-action'
  | 'delete-selected-items'
  | 'move-selected-item'
  | 'temporarily-enable-snapping'
  | 'zoom-canvas'
  | 'open-keyboard-shortcuts'
  | 'toggle-grid'
  | 'toggle-snap-to-grid'
  | 'reset-view'
  | 'fit-diagram-to-view'
  | 'toggle-component-panel'

type ShortcutKey =
  | 'zero'
  | 'space'
  | 'escape'
  | 'backspace'
  | 'shift'
  | 'arrows'
  | 'question-mark'
  | 'scroll'
  | 'f'
  | 'g'
  | 'p'
  | 'shift-g'

type Shortcut = {
  mod: boolean
  key: ShortcutKey
  displayKeys?: string[]

  action: ShortcutAction
}
type ShortcutCategory = 'general' | 'view' | 'selection' | 'movement'
type Shortcuts = Record<ShortcutCategory, Shortcut[]>

export const SHORTCUTS: Shortcuts = {
  general: [
    { mod: false, key: 'space', action: 'pan-canvas' },
    { mod: false, key: 'escape', action: 'cancel-current-action' },
    {
      mod: false,
      key: 'question-mark',
      displayKeys: ['?'],
      action: 'open-keyboard-shortcuts',
    },
  ],

  selection: [
    {
      mod: true,
      key: 'backspace',
      displayKeys: ['⌫'],
      action: 'delete-selected-items',
    },
  ],
  movement: [
    {
      mod: false,
      key: 'arrows',
      displayKeys: ['↑', '↓', '←', '→'],
      action: 'move-selected-item',
    },

    { mod: false, key: 'shift', action: 'temporarily-enable-snapping' },
  ],
  view: [
    {
      mod: true,
      key: 'scroll',
      displayKeys: ['Scroll'],
      action: 'zoom-canvas',
    },
    { mod: false, key: 'g', displayKeys: ['G'], action: 'toggle-grid' },
    {
      mod: false,
      key: 'shift-g',
      displayKeys: ['Shift', 'G'],
      action: 'toggle-snap-to-grid',
    },
    { mod: false, key: 'zero', displayKeys: ['0'], action: 'reset-view' },
    { mod: false, key: 'f', displayKeys: ['F'], action: 'fit-diagram-to-view' },
    {
      mod: false,
      key: 'p',
      displayKeys: ['P'],
      action: 'toggle-component-panel',
    },
  ],
}
