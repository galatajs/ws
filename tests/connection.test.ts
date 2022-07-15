import { createWsApp, WsApp } from "../lib";
import { createApp } from "@istanbul/app";
import { io as Client } from "socket.io-client";
import { createServer } from "http";
import { AddressInfo } from "net";

describe("Connection testing", () => {
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

  test("check connection", () => {
    expect(clientSocket.connected).toBe(true);
  });
});
