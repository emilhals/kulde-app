import { useState, useRef, useEffect, useCallback } from 'react'

type Options = {
  url: string
  pingInterval: number
}

export const useWebSocket = (url: string) => {
  const [connectionStatus, setConnectionStatus] = useState<string>('CLOSED')
  const [recieved, setRecieved] = useState<string>('')
  const websocketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const websocket = new WebSocket(url)
    websocketRef.current = websocket

    websocket.onopen = () => {
      setConnectionStatus('OPEN')
    }

    websocket.onclose = () => {
      setConnectionStatus('CLOSED')
    }

    websocket.onerror = (error) => {
      console.error('WebSocket error: ', error)
    }

    websocket.onmessage = (event: MessageEvent) => {
      setRecieved(event.data)
      console.log('Recieved', event.data)
    }

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close()
      }
    }
  }, [url])

  const send = useCallback(<T>(message: T) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(message)
    }
  }, [])

  return {
    connectionStatus,
    send,
    recieved,
  }
}
