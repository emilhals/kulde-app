#!/usr/bin/env python

# WebSockets info
# https://datatracker.ietf.org/doc/html/rfc6455.html

import asyncio
import json
import logging

from app.api.endpoint import Endpoint

from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosed
from websockets.typing import Data

logging.basicConfig(
    format="%(asctime)s %(message)s",
    level=logging.DEBUG,
)


endpoint = Endpoint()


async def consume(message: Data):
    logging.debug("consumed: %v", json.loads(message))


async def receive(websocket: WebSocket):
    async for message in websocket:
        await consume(message)


async def produce():
    await asyncio.sleep(1)
    return {"connections": len(endpoint.connections)}


async def consumer_handler(websocket: WebSocket):
    async for message in websocket:
        await consume(message)


async def producer_handler(websocket: WebSocket):
    while True:
        try:
            message = await produce()
            await websocket.send(json.dumps(message))
        except ConnectionClosed:
            break


async def handler(websocket: WebSocket):
    global endpoint
    consumer_task = asyncio.create_task(consumer_handler(websocket))
    producer_task = asyncio.create_task(producer_handler(websocket))

    await endpoint.accept(ws=websocket)

    done, pending = await asyncio.wait(
        [consumer_task, producer_task],
        return_when=asyncio.FIRST_COMPLETED,
    )
    for task in pending:
        task.cancel()
    if done:
        await endpoint.close(ws=websocket)


async def main():
    async with serve(handler, "", 8001) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())
