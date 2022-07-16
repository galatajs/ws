import { createWsApp, WsApp } from "../lib";
import { createApp } from "@istanbul/app";
import { io as Client } from "socket.io-client";
import { createServer } from "http";
import { AddressInfo } from "net";

describe("Listener testing", () => {
  let ws: WsApp, clientSocket;

  beforeAll((done) => {
    const app = createApp();
    const httpServer = createServer();
    ws = createWsApp(httpServer);
    app.register(ws);
    app.start();
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = Client(`http://localhost:${port}`, { path: "/ws/" });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    ws.context!.close();
    clientSocket.close();
  });

  test("listen a event", () => {
    ws.listen("test", (socket, req, res) => {
      res.reply("testing");
    });
    clientSocket.emit("test", (msg) => {
      expect(msg).toBe("testing");
    });
  });

  test("listen a event with request body", () => {
    ws.listen("test", (socket, req, res) => {
      res.reply(req.body.test);
    });
    clientSocket.emit("test", { test: "testing" }, (msg) => {
      expect(msg).toBe("testing");
    });
  });

  test("listen a event and send emit to client from server", () => {
    clientSocket.on("test-reply", (msg) => {
      expect(msg).toBe("testing");
    });
    ws.listen("test", (socket, req, res) => {
      socket.emit("test", "testing");
    });
    clientSocket.emit("test");
  });

  test("listen a event and check request ip address", () => {
    ws.listen("test", (socket, req, res) => {
      res.reply(req.ip);
    });
    clientSocket.emit("test", (msg) => {
      expect(msg).toBe("::1");
    });
  });

  test("all event listener testing", () => {
    ws.listen("*", (socket, req, res) => {
      res.reply("all listener");
    });
    ws.listen("hello", (socket, req, res) => {
      res.reply("hello listener");
    });
    clientSocket.emit("hello", (msg) => {
      expect(msg).toBe("all listener");
    });
  });

  test("prepend event listener testing", () => {
    ws.listen("<*", (socket, req, res) => {
      res.reply("prepend listener");
    });
    ws.listen("hello", (socket, req, res) => {
      res.reply("hello listener");
    });
    clientSocket.emit("hello", (msg) => {
      expect(msg).toBe("prepend listener");
    });
  });
});
