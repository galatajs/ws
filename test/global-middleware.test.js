"use-strict";
const { createServer } = require("node:http");
const assert = require("node:assert");
const test = require("node:test");
const { createApp } = require("@istanbul/app");
const { io: Client } = require("socket.io-client");
const { createWsApp } = require("../dist");

test("Global Middleware Testing", async (t) => {
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

  await t.test("listen a event with timeout global middleware", () => {
    const time = new Date().getTime();

    const middleware = (socket, req, res, next) => {
      setTimeout(() => {
        next();
      }, 1100);
    };

    ws.use(middleware);

    ws.listen("test", (socket, req, res) => {
      res.reply(new Date().getTime() - time);
    });
    clientSocket.emit("test", (date) => {
      assert.strictEqual(date > 1000, true);
    });
  });

  await t.test("throw a error before the listener", () => {
    const middleware = (socket, next) => {
      next(new Error("closed on middleware"));
    };
    let num = 1;

    ws.use(middleware);

    ws.listen("test", (socket, req, res) => {
      num++;
      res.reply("closed on listener");
    });
    clientSocket.emit("test", (msg) => {});
    clientSocket.on("connect_error", (err) => {
      assert.strictEqual(err.message, "closed on middleware");
      assert.strictEqual(num, 1);
    });
  });

  await t.test("afterAll", async () => {
    ws.context.close();
    clientSocket.close();
  });
});
