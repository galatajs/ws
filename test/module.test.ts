import { createApp } from "@istanbul/app";
import { createHttpServer, HttpApplication } from "@istanbul/http";
import { io as Client, Socket } from "socket.io-client";
import { createWsApp, WsApp } from "../dist";

type TestApp = {
  server: HttpApplication;
  client: Socket;
  ws: WsApp;
};

const createTestApp = async (): Promise<TestApp> => {
  const app = createApp();
  const server = createHttpServer();
  server.config.port = 7052;
  const ws = createWsApp();
  ws.config.port = 7052;
  app.register(server);
  app.register(ws);
  server.onServerStarted(ws.bindHttpServer());
  return new Promise<TestApp>((resolve, reject) => {
    server.onServerStarted(() => {
      const client = Client(`http://127.0.0.1:7052`, {
        path: "/ws/",
      });
      client.on("connect", () => {
        resolve({
          server,
          client,
          ws,
        });
      });
    });
    app.start();
  });
};

describe("Websocket Module Testing", () => {
  let server: HttpApplication, ws: WsApp, client: Socket;

  beforeAll(async () => {
    const app = await createTestApp();
    server = app.server;
    ws = app.ws;
    client = app.client;
  });

  it("client connected testing", () => {
    expect(client.connected).toBeTruthy();
  });

  afterAll(() => {
    server.close();
    ws.close();
    client.close();
  });
});
