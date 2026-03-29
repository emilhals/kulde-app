import { v4 as uuidv4 } from 'uuid'

import {
    ItemType,
    ConnectionType,
    TextType,
    ItemPreview,
    TextPreview,
    ConnectionPreview,
} from '@/features/diagram-drawer/types'

import { diagramHistory } from './models.ts'

type StoreMap = {
    items: ItemType
    texts: TextType
    connections: ConnectionType
}

export const getFromStore = <T extends keyof StoreMap>(
    id: string,
    type: T,
): StoreMap[T] | undefined => {
    return (diagramHistory.value[type] as StoreMap[T][]).find(
        (object) => object.id === id,
    )
}

export const getAnyFromStore = (id: string) => {
    return (
        diagramHistory.value.items.find((object) => object.id === id) ??
        diagramHistory.value.connections.find((object) => object.id === id) ??
        null
    )
}

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
                connection.from.id === property.id ||
                connection.to.id === property.id,
        )

        filteredConnections.forEach((connection) => {
            const index = connections.findIndex(
                (con) => con.id === connection.id,
            )
            if (index >= 0) {
                connections.splice(index, 1)
            }
        })

        const texts = diagramHistory.value.texts

        const attachedTexts = texts.filter(
            (text) =>
                text.anchor?.type === 'item' &&
                text.anchor.itemId === property.id,
        )

        attachedTexts.forEach((text) => {
            const index = texts.findIndex((t) => t.id === text.id)
            if (index >= 0) {
                texts.splice(index, 1)
            }
        })
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
