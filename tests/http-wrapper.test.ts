import { createWsApp, wrapHttpMiddleware, WsApp } from "../lib";
import { createApp } from "@istanbul/app";
import { io as Client } from "socket.io-client";
import { createServer } from "http";
import { AddressInfo } from "net";

describe("Http Wrapper testing", () => {
  let ws: WsApp, clientSocket;

  beforeAll((done) => {
    const app = createApp();
    const httpServer = createServer();
    ws = createWsApp(httpServer);
    app.register(ws);
    console.log("benden sonra");
    app.start();
    console.log("benden önce");
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

  test("listen a event with timeout global http middleware", () => {
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
      expect(date).toBeGreaterThan(1000);
    });
  });

  test("throw a error before the listener", () => {
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
      expect(err.message).toBe("closed on middleware");
      expect(num).toBe(1);
    });
  });

  test("get request ip address on http middleware", () => {
    const middleware = (req, res, next) => {
      if (req.ip !== "::1") return next();
      next(new Error("ip address is ::1"));
    };
    ws.use(wrapHttpMiddleware(middleware));
    ws.listen("test", (socket, req, res) => {
      res.reply("testing");
    });
    clientSocket.emit("test", (msg) => {
      expect(msg).toBe("testing");
    });
    clientSocket.on("connect_error", (err) => {
      expect(err.message).toBe("ip address is ::1");
    });
  });
});
