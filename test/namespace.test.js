"use-strict";
const { createServer } = require("node:http");
const assert = require("node:assert");
const test = require("node:test");
const { createApp } = require("@istanbul/app");
const { io: Client } = require("socket.io-client");
const { createWsApp, createNamespace } = require("../dist");

test("Namespace Testing", async (t) => {
  let ws, clientSocket, nsClientSocket, ns;

  await t.test("beforeAll", async () => {
    return new Promise((resolve, reject) => {
      const app = createApp();
      const httpServer = createServer();
      ws = createWsApp(httpServer);
      app.register(ws);
      ns = createNamespace("admin", 1); // ? versioned namespace
      app.start();
      httpServer.listen(() => {
        const port = httpServer.address().port;
        clientSocket = Client(`http://localhost:${port}`, { path: "/ws/" });
        nsClientSocket = Client(`http://localhost:${port}/admin.1`, {
          path: "/ws/",
        });
        const checkConnection = () => {
          if (clientSocket.connected && nsClientSocket.connected) {
            resolve();
          }
        };
        clientSocket.on("connect", checkConnection);
        nsClientSocket.on("connect", checkConnection);
      });
    });
  });

  await t.test("listen a event with ns", () => {
    ns.listen("abc", (socket, req, res) => {
      res.reply("testing");
    });
    clientSocket.emit("abc", (msg) => {
      assert.strictEqual(msg, "testing");
    });
  });

  await t.test("listen a event with request body with ns", () => {
    ns.listen("abnc", (socket, req, res) => {
      res.reply(req.body.test);
    });
    clientSocket.emit("abc", { test: "testing" }, (msg) => {
      expect(msg).toBe("testing");
    });
  });

  await t.test("use namespace connection hook", () => {
    nsClientSocket.on("connection_handled", (msg) => {
      assert.strictEqual(msg, "hello");
    });
    ns.context.on("connection", (socket) => {
      socket.emit("connection_handled", "hello");
    });
  });

  await t.test("afterAll", async () => {
    ws.close();
    clientSocket.close();
    nsClientSocket.close();
  });
});
