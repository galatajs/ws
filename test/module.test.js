"use-strict";
const test = require("node:test");
const { createApp } = require("@istanbul/app");
const { createHttpServer } = require("@istanbul/http");
const { io: Client } = require("socket.io-client");
const { createWsApp } = require("../dist");

test("Websocket Module Testing", async (t) => {
  let server, ws, client;
  await t.test("bindHttpServer method testing", () => {
    return new Promise((resolve, reject) => {
      const app = createApp();
      server = createHttpServer();
      server.config.port = 7052;
      ws = createWsApp();
      ws.config.port = 7052;
      app.register(server);
      app.register(ws);
      server.onServerStarted(ws.bindHttpServer());
      server.onServerStarted(() => {
        client = Client(`http://127.0.0.1:7052`, {
          path: "/ws/",
        });
        client.on("connect", () => {
          resolve();
        });
      });
      app.start();
    });
  });

  await t.test("client connected testing", () => {
    assert.strictEqual(client.connected, true);
  });

  await t.test("afterAll", async () => {
    server.close();
    ws.close();
    client.close();
  });
});
