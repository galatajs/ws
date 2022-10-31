"use-strict";
const { createServer } = require("node:http");
const assert = require("node:assert");
const test = require("node:test");
const { createApp } = require("@galatajs/app");
const { io: Client } = require("socket.io-client");
const { createWsApp } = require("../dist");

test("Internal Middleware Testing", async (t) => {
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

  await t.test("listen a event with timeout middleware", () => {
    const time = new Date().getTime();

    const middleware = (socket, req, res, next) => {
      setTimeout(() => {
        next();
      }, 1100);
    };

    ws.listen("test", [middleware], (socket, req, res) => {
      res.reply(new Date().getTime() - time);
    });
    clientSocket.emit("test", (date) => {
      assert.strictEqual(date > 1000, true);
    });
  });

  await t.test("close the event before the listener", () => {
    const middleware = (socket, req, res, next) => {
      next("closed on middleware");
    };

    ws.listen("test", [middleware], (socket, req, res) => {
      res.reply("closed on listener");
    });
    clientSocket.emit("test", (msg) => {
      assert.strictEqual(msg, "closed on middleware");
    });
  });

  await t.test("add anything to socket data on before listener", () => {
    const middleware = (socket, req, res, next) => {
      socket.data = "testing";
      next();
    };

    ws.listen("test", [middleware], (socket, req, res) => {
      res.reply(socket.data);
    });
    clientSocket.emit("test", (msg) => {
      assert.strictEqual(msg, "testing");
    });
  });

  await t.test("afterAll", async () => {
    ws.close();
    clientSocket.close();
  });
});
