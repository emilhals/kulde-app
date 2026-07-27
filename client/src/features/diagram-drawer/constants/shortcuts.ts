type ShortcutAction =
  | 'pan-canvas'
  | 'cancel-current-action'
  | 'delete-selected-items'
  | 'move-selected-item'
  | 'move-selected-item-down'
  | 'move-selected-item-left'
  | 'move-selected-item-right'
  | 'temporarily-enable-snapping'

type Shortcut = {
  mod: boolean
  key: string
  displayKeys?: string[]

  action: ShortcutAction
}
type ShortcutCategory = 'general' | 'selection' | 'movement'
type Shortcuts = Record<ShortcutCategory, Shortcut[]>

export const SHORTCUTS: Shortcuts = {
  general: [
    { mod: false, key: 'space', action: 'pan-canvas' },
    { mod: false, key: 'escape', action: 'cancel-current-action' },
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
}
