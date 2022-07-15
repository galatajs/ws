import { createWsApp, WsApp } from "../lib";
import { createApp } from "@istanbul/app";
import { io as Client } from "socket.io-client";
import { createServer } from "http";
import { AddressInfo } from "net";

describe("Global Middleware testing", () => {
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

  test("listen a event with timeout global middleware", () => {
    const time = new Date().getTime();

    const middleware = (socket, next) => {
      setTimeout(() => {
        next();
      }, 1100);
    };

    ws.use(middleware);

    ws.listen("test", (socket, req, res) => {
      res.reply(new Date().getTime() - time);
    });
    clientSocket.emit("test", (date) => {
      expect(date).toBeGreaterThan(1000);
    });
  });

  test("throw a error before the listener", () => {
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
      expect(err.message).toBe("closed on middleware");
      expect(num).toBe(1);
    });
  });
});
