"use-strict";
const { createServer } = require("node:http");
const assert = require("node:assert");
const test = require("node:test");
const { createApp } = require("@istanbul/app");
const { io: Client } = require("socket.io-client");
const { createWsApp } = require("../dist");

test("Connection Testing", async (t) => {
  let ws, clientSocket, port;
  await t.test("beforeAll", async () => {
    return new Promise((resolve, reject) => {
      const app = createApp();
      const httpServer = createServer();
      ws = createWsApp(httpServer);
      app.register(ws);
      app.start();
      httpServer.listen(() => {
        port = httpServer.address().port;
        clientSocket = Client(`http://localhost:${port}`, { path: "/ws/" });
        clientSocket.on("connect", resolve);
      });
    });
  });

  await t.test("check connection", async () => {
    assert.strictEqual(clientSocket.connected, true);
  });

  await t.test("use socket connected hook", async () => {
    ws.onSocketConnect((socket) => {
      assert.strictEqual(socket.connected, true);
    });
    let secondSocket = Client(`http://localhost:${port}`, { path: "/ws/" });
    setTimeout(() => {
      secondSocket.close();
    }, 1000);
  });

  await t.test("use socket disconnected hook", async () => {
    ws.onSocketDisconnect((socket) => {
      assert.strictEqual(socket.connected, false);
    });
    let secondSocket = Client(`http://localhost:${port}`, { path: "/ws/" });
    secondSocket.close();
  });

  await t.test("afterAll", async () => {
    ws.close();
    clientSocket.close();
  });
});
