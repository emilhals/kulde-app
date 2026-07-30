import Konva from 'konva'
import { getAnyFromStore } from '../store/actions'

export const getProxyObjectFromNode = (target: Konva.Node) => {
  let node: Konva.Node | null = target

  while (node) {
    const proxyObject = getAnyFromStore(node.id())

    if (proxyObject?.type === 'connections' || proxyObject?.type === 'items') {
      return proxyObject
    }

    node = node.getParent()
  }
  return null
}
