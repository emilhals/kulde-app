import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'
import { proxyWithHistory } from 'valtio-history'

import {
  ItemType,
  ConnectionType,
  TextType,
  ItemPreview,
  TextPreview,
  ConnectionPreview,
  ComponentType,
} from '@/features/diagram-drawer/types'

import { v4 as uuidv4 } from 'uuid'

const initialDiagramState = {
  items: [] as ItemType[],
  connections: [] as ConnectionType[],
  texts: [] as TextType[],
}

const initialUIState = {
  selected: null as ItemType | null,
  dragged: null as ComponentType | null,
  action: null as string | null,
}

export const diagramHistory = proxyWithHistory(initialDiagramState)
export const uiState = proxy(deepClone(initialUIState))

export const addToStore = (
  property: ItemPreview | TextPreview | ConnectionPreview,
) => {
  if (!property || !property.type) return null

  const id = uuidv4()

  if (property.type === 'items') {
    const newItem = { ...property, id: id }

    diagramHistory.value.items.push(newItem)
    return newItem
  }

  if (property.type === 'texts') {
    const newText = { ...property, id: id }
    diagramHistory.value.texts.push(newText)
    return newText
  }

  if (property.type === 'connections') {
    const newConnection = { ...property, id: id }
    diagramHistory.value.connections.push(newConnection)

    return newConnection
  }
}

export const getFromStore = (id: string) => {
  return (
    diagramHistory.value.items.find((object) => object.id === id) ??
    diagramHistory.value.texts.find((object) => object.id === id) ??
    diagramHistory.value.connections.find((object) => object.id === id)
  )
}

export const removeFromStore = (
  property: ItemType | TextType | ConnectionType,
) => {
  if (!property) return null

  const properties = diagramHistory.value[property.type]

  /* If the property is an Item, we want to remove the connection and text belonging to it */
  if (property.type === 'items') {
    const connections = diagramHistory.value.connections

    const filteredConnections = connections.filter(
      (connection) =>
        connection.from?.id === property.id ||
        connection.to?.id === property.id,
    )

    filteredConnections.forEach((connection) => {
      const index = connections.findIndex((con) => con.id === connection.id)
      if (index >= 0) {
        connections.splice(index, 1)
      }
    })

    if (property.text) {
      const index = diagramHistory.value.texts.findIndex(
        (text) => text.id === property.text.id,
      )
      if (index >= 0) {
        diagramHistory.value.texts.splice(index, 1)
      }
    }
  }

  const index = properties.findIndex((object) => object.id === property.id)

  if (index >= 0) {
    properties.splice(index, 1)
  }
}

export const clearStore = () => {
  diagramHistory.value.items.length = 0
  diagramHistory.value.connections.length = 0
  diagramHistory.value.texts.length = 0

  Object.assign(uiState, deepClone(initialUIState))
}
