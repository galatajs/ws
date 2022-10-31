"use-strict";
const { createServer } = require("node:http");
const assert = require("node:assert");
const test = require("node:test");
const { createApp } = require("@galatajs/app");
const { io: Client } = require("socket.io-client");
const { createWsApp } = require("../dist");

test("Listener Testing", async (t) => {
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

  await t.test("listen a event", () => {
    ws.listen("test", (socket, req, res) => {
      res.reply("testing");
    });
    clientSocket.emit("test", (msg) => {
      assert.strictEqual(msg, "testing");
    });
  });

  await t.test("listen a event with request body", () => {
    ws.listen("test", (socket, req, res) => {
      res.reply(req.body.test);
    });
    clientSocket.emit("test", { test: "testing" }, (msg) => {
      assert.strictEqual(msg, "testing");
    });
  });

  await t.test("listen a event and send emit to client from server", () => {
    clientSocket.on("test-reply", (msg) => {
      assert.strictEqual(msg, "testing");
    });
    ws.listen("test", (socket, req, res) => {
      socket.emit("test", "testing");
    });
    clientSocket.emit("test");
  });

  await t.test("listen a event and check request ip address", () => {
    ws.listen("test", (socket, req, res) => {
      res.reply(req.ip);
    });
    clientSocket.emit("test", (msg) => {
      assert.strictEqual(msg, "::1");
    });
  });

  await t.test("any event listener testing", () => {
    ws.listen("*", (socket, req, res) => {
      res.reply("any listener");
    });
    ws.listen("hello", (socket, req, res) => {
      res.reply("hello listener");
    });
    clientSocket.emit("hello", (msg) => {
      assert.strictEqual(msg, "any listener");
    });
  });

  await t.test("prepend event listener testing", () => {
    ws.listen("<*", (socket, req, res) => {
      res.reply("prepend listener");
    });
    ws.listen("hello", (socket, req, res) => {
      res.reply("hello listener");
    });
    clientSocket.emit("hello", (msg) => {
      assert.strictEqual(msg, "prepend listener");
    });
  });

  await t.test("afterAll", async () => {
    ws.close();
    clientSocket.close();
  });
});
