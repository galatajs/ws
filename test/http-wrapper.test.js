"use-strict";
const { createServer } = require("node:http");
const assert = require("node:assert");
const test = require("node:test");
const { createApp } = require("@istanbul/app");
const { io: Client } = require("socket.io-client");
const { createWsApp, wrapHttpMiddleware } = require("../dist");

test("Http Wrapper Testing", async (t) => {
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

  await t.test("listen a event with timeout global http middleware", () => {
    const time = new Date().getTime();

    const middleware = (req, res, next) => {
      setTimeout(() => {
        next();
      }, 1100);
    };

    ws.use(wrapHttpMiddleware(middleware));

    ws.listen("test", (socket, req, res) => {
      res.reply(new Date().getTime() - time);
    });
    clientSocket.emit("test", (date) => {
      assert.strictEqual(date > 1000, true);
    });
  });

  await t.test("throw a error before the listener", () => {
    const middleware = (req, res, next) => {
      next(new Error("closed on middleware"));
    };
    let num = 1;

    ws.use(wrapHttpMiddleware(middleware));

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

  await t.test("get request ip address on http middleware", () => {
    const middleware = (req, res, next) => {
      if (req.ip !== "::1") return next();
      next(new Error("ip address is ::1"));
    };
    ws.use(wrapHttpMiddleware(middleware));
    ws.listen("test", (socket, req, res) => {
      res.reply("testing");
    });
    clientSocket.emit("test", (msg) => {
      assert.strictEqual(msg, "testing");
    });
    clientSocket.on("connect_error", (err) => {
      assert.strictEqual(err.message, "ip address is ::1");
    });
  });

  await t.test("afterAll", async () => {
    ws.close();
    clientSocket.close();
  });
});
