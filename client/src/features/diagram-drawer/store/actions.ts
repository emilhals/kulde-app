import {
    Connection,
    Item,
    Text,
    WithoutId,
} from '@/features/diagram-drawer/types'
import { v4 as uuidv4 } from 'uuid'
import { deepClone } from 'valtio/utils'
import { diagramHistory, initialUIState, uiState } from './models.ts'

type StoreMap = {
    items: Item
    texts: Text
    connections: Connection
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
    property: WithoutId<Item> | WithoutId<Text> | WithoutId<Connection>,
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

export const removeFromStore = (id: string) => {
    if (!id) return null

    const proxy = getAnyFromStore(id)
    if (!proxy) return null

    /* If the property is an Item, we want to remove the connection and text belonging to it */
    if (proxy.type === 'items') {
        const connections = diagramHistory.value.connections

        const filteredConnections = connections.filter(
            (connection) =>
                (connection.from.type === 'item' &&
                    connection.from.itemId === proxy.id) ||
                (connection.to.type === 'item' &&
                    connection.to.itemId === proxy.id),
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
                text.anchor?.type === 'item' && text.anchor.itemId === proxy.id,
        )

        attachedTexts.forEach((text) => {
            const index = texts.findIndex((t) => t.id === text.id)
            if (index >= 0) {
                texts.splice(index, 1)
            }
        })

        const index = diagramHistory.value.items.findIndex(
            (element) => element.id === id,
        )

        if (index >= 0) {
            diagramHistory.value.items.splice(index, 1)
        }
    }
}

export const clearStore = () => {
    diagramHistory.value.items.length = 0
    diagramHistory.value.connections.length = 0
    diagramHistory.value.texts.length = 0

    Object.assign(uiState, deepClone(initialUIState))
}
