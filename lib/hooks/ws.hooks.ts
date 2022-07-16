import {
  isWebsocketParams,
  WebsocketConfigParams,
} from "../types/config.params";
import { WsApp, WsAppCreator } from "../app/ws.app";
import { Server } from "socket.io";
import { CorePlugin } from "@istanbul/app";
import { HttpServerForWs } from "../types/types";
import { createConfig } from "./config.hooks";
import { createWsService } from "./service.hooks";
import { createMiddlewareImplementer } from "./middleware.hooks";
import { createListenerCreator } from "./listener.hooks";
import {
  createMainNamespace,
  createNamespace,
  createNamespaceImplementer,
} from "./namespace.hooks";
import { WebsocketConfig } from "../config/config";
import { WsStoreKeys as PrivateWsStoreKeys } from "../store/ws.store-keys";
import {
  wsStore as publicWsStore,
  WsStoreKeys as PublicWsStoreKeys,
} from "../store/ws.store.public";
import { wsStorage as privateWsStorage } from "../store/ws.store.private";
import { Adapter } from "socket.io-adapter";
import { AdapterConstructor } from "../adapter/adapter";

export const createWsApp: WsAppCreator = (
  httpServer?:
    | HttpServerForWs
    | (WebsocketConfigParams & { server?: HttpServerForWs })
): WsApp => {
  const config: WebsocketConfig = createConfig(
    isWebsocketParams(httpServer) ? httpServer : undefined
  );
  const mainNamespace = createMainNamespace();
  privateWsStorage.provide(PrivateWsStoreKeys.MainNamespace, mainNamespace);
  return {
    config: config,
    context: undefined,
    mainNamespace: mainNamespace,
    ...createMiddlewareImplementer(mainNamespace.middlewares),
    ...createListenerCreator(mainNamespace.listeners),
    of: createNamespace,
    build(): CorePlugin {
      return {
        name: "ws",
        version: "1.0.0",
        onAppStarted: (hook) => {},
        install: () => {
          privateWsStorage.provide(
            PrivateWsStoreKeys.ErrorHandler,
            this.config.errorHandler
          );
          this.context = new Server(httpServer, {
            path: this.config.prefix,
            serveClient: this.config.serveClient,
            connectTimeout: this.config.connectTimeout,
            cors: this.config.cors,
          });
          if (this.config.adapter) {
            this.context.adapter(this.config.adapter);
          }
          publicWsStore.provide(PublicWsStoreKeys.context, this.context);
          createWsService(this.mainNamespace).mount(
            this.context,
            this.mainNamespace,
            !!!httpServer
          );
        },
      };
    },
  };
};
