import { createApp } from "@istanbul/app";
import { createServer } from "http";
import { createWsApp, WsApp, wsStore, WsStoreKeys } from "../dist";
import { io as Client, Socket } from "socket.io-client";

describe("WsStore Testing", () => {
  let ws: WsApp, clientSocket: Socket;

  beforeAll(async () => {
    const app = createApp();
    const httpServer = createServer();
    ws = createWsApp(httpServer);
    app.register(ws);
    app.start();
    return new Promise<boolean>((resolve, reject) => {
      httpServer.listen(() => {
        const port = (httpServer.address() as any).port;
        clientSocket = Client(`http://localhost:${port}`, { path: "/ws/" });
        clientSocket.on("connect", () => {
          resolve(true);
        });
      });
    });
  });

  it("check context is provided", () => {
    const context: any = wsStore.inject(WsStoreKeys.context);
    expect(context).not.toBeUndefined();
    expect(context!.on).not.toBeUndefined();
  });

  afterAll(() => {
    ws.close();
    clientSocket.close();
  });
});
