import { Namespace, createWsApp, WsApp, createNamespace } from "../lib";
import { createApp } from "@istanbul/app";
import { io as Client } from "socket.io-client";
import { createServer } from "http";
import { AddressInfo } from "net";

describe("Namespace testing", () => {
  let ws: WsApp, clientSocket, ns: Namespace, nsClientSocket;

  beforeAll((done) => {
    const app = createApp();
    const httpServer = createServer();
    ws = createWsApp(httpServer);
    app.register(ws);
    ns = createNamespace("admin");
    app.start();
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = Client(`http://localhost:${port}`, { path: "/ws/" });
      nsClientSocket = Client(`http://localhost:${port}/admin`, {
        path: "/ws/",
      });

      const checkConnection = () => {
        if (clientSocket.connected && nsClientSocket.connected) {
          done();
        }
      };
      clientSocket.on("connect", checkConnection);
      nsClientSocket.on("connect", checkConnection);
    });
  });

  afterAll(() => {
    ws.context!.close();
    clientSocket.close();
  });

  test("listen a event with ns", () => {
    ns.listen("abc", (socket, req, res) => {
      res.reply("testing");
    });
    clientSocket.emit("abc", (msg) => {
      expect(msg).toBe("testing");
    });
  });

  test("listen a event with request body with ns", () => {
    ns.listen("abc", (socket, req, res) => {
      res.reply(req.body.test);
    });
    clientSocket.emit("abc", { test: "testing" }, (msg) => {
      expect(msg).toBe("testing");
    });
  });
});
