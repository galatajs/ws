"use-strict";
const { createServer } = require("node:http");
const assert = require("node:assert");
const test = require("node:test");
const { createApp } = require("@istanbul/app");
const { io: Client } = require("socket.io-client");
const { createWsApp, wsStore, WsStoreKeys } = require("../dist");

test("WsStore Testing", async (t) => {
  let ws, clientSocket;
  await t.test("beforeAll", async () => {
    return new Promise((resolve, reject) => {
      const app = createApp();
      const httpServer = createServer();
      ws = createWsApp(httpServer);
      app.register(ws);
      app.start();
      httpServer.listen(() => {
        const port = httpServer.address().port;
        clientSocket = Client(`http://localhost:${port}`, { path: "/ws/" });
        clientSocket.on("connect", resolve);
      });
    });
  });

  await t.test("check context is provided", async () => {
    const context = wsStore.inject(WsStoreKeys.context);
    assert.notStrictEqual(context, undefined);
    assert.notStrictEqual(context.on, undefined);
  });

  await t.test("afterAll", async () => {
    ws.context.close();
    clientSocket.close();
  });
});
