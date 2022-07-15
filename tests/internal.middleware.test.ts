import { createWsApp, WsApp } from "../lib";
import { createApp } from "@istanbul/app";
import { io as Client } from "socket.io-client";
import { createServer } from "http";
import { AddressInfo } from "net";

describe("Internal Middleware testing", () => {
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

  test("listen a event with timeout middleware", () => {
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
      expect(date).toBeGreaterThan(1000);
    });
  });

  test("close the event before the listener", () => {
    const middleware = (socket, req, res, next) => {
      next("closed on middleware");
    };

    ws.listen("test", [middleware], (socket, req, res) => {
      res.reply("closed on listener");
    });
    clientSocket.emit("test", (msg) => {
      expect(msg).toBe("closed on middleware");
    });
  });

  test("add anything to socket data on before listener", () => {
    const middleware = (socket, req, res, next) => {
      socket.data = "testing";
      next();
    };

    ws.listen("test", [middleware], (socket, req, res) => {
      res.reply(socket.data);
    });
    clientSocket.emit("test", (msg) => {
      expect(msg).toBe("testing");
    });
  });
});
