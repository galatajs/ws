"use-strict";
const { createServer } = require("node:http");
const assert = require("node:assert");
const test = require("node:test");
const { createApp } = require("@istanbul/app");
const { io: Client } = require("socket.io-client");
const { createWsApp } = require("../dist");

test("Connection Testing", async (t) => {
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

  await t.test("check connection", async () => {
    assert.strictEqual(clientSocket.connected, true);
  });

  await t.test("afterAll", async () => {
    ws.context.close();
    clientSocket.close();
  });
});
