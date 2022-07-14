import {
  isWebsocketParams,
  WebsocketConfigParams,
} from "../types/config.params";
import { WsApp } from "../app/ws.app";
import { Server } from "socket.io";
import { CorePlugin } from "@istanbul/app";
import { HttpServerForWs } from "../types/types";
import { createConfig } from "./config.hooks";
import { createWsService } from "./service.hooks";
import { createMiddlewareImplementer } from "./middleware.hooks";
import { createListenerCreator } from "./listener.hooks";
import { createMainNamespace } from "./namespace.hooks";
import { WebsocketConfig } from "../config/config";
import { wsStore, WsStoreKeys } from "../store/ws.store.public";

export const createWsApp = (
  httpServer?:
    | HttpServerForWs
    | (WebsocketConfigParams & { server: HttpServerForWs })
): WsApp => {
  const config: WebsocketConfig = createConfig(
    isWebsocketParams(httpServer) ? httpServer : undefined
  );
  const mainNamespace = createMainNamespace();
  const service = createWsService(mainNamespace);

  return {
    config: config,
    context: undefined,
    mainNamespace: mainNamespace,
    ...createMiddlewareImplementer(),
    ...createListenerCreator(mainNamespace.listeners),
    build(): CorePlugin {
      return {
        name: "ws",
        version: "1.0.0",
        onAppStarted(hook) {},
        install: () => {
          this.context = new Server(httpServer, {
            path: this.config.prefix,
            serveClient: this.config.serveClient,
            connectTimeout: this.config.connectTimeout,
            cors: this.config.cors,
          });
          wsStore.provide(WsStoreKeys.context, this.context);
          service.mount(this.context, !!!httpServer);
        },
      };
    },
  };
};
