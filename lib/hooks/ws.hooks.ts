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
import {
  createMainNamespace,
  createNamespaceImplementer,
} from "./namespace.hooks";
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
  return {
    config: config,
    context: undefined,
    mainNamespace: mainNamespace,
    ...createMiddlewareImplementer(mainNamespace.middlewares),
    ...createListenerCreator(mainNamespace.listeners),
    ...createNamespaceImplementer(mainNamespace.namespaces),
    build(): CorePlugin {
      return {
        name: "ws",
        version: "1.0.0",
        onAppStarted: (hook) => {},
        install: () => {
          this.context = new Server(httpServer, {
            path: this.config.prefix,
            serveClient: this.config.serveClient,
            connectTimeout: this.config.connectTimeout,
            cors: this.config.cors,
          });
          const service = createWsService(this.mainNamespace);
          wsStore.provide(WsStoreKeys.context, this.context);
          service.mount(this.context, this.mainNamespace, !!!httpServer);
        },
      };
    },
  };
};
