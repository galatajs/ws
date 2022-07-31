import { IncomingMessage, ServerResponse } from "node:http";
import { App, CorePlugin, warn } from "@istanbul/app";
import { Server } from "socket.io";
import {
  isWebsocketParams,
  WebsocketConfigParams,
} from "../types/config.params";
import { WsApp, WsAppCreator } from "../app/ws.app";
import { HttpServerForWs, OnServerStartedEvent } from "../types/types";
import { createConfig } from "./config.hooks";
import { createWsService } from "./service.hooks";
import { createMiddlewareImplementer } from "./middleware.hooks";
import { createListenerCreator } from "./listener.hooks";
import { createMainNamespace, createNamespace } from "./namespace.hooks";
import { WebsocketConfig } from "../config/config";
import { WsStoreKeys as PrivateWsStoreKeys } from "../store/ws.store-keys";
import {
  wsStore as publicWsStore,
  WsStoreKeys as PublicWsStoreKeys,
} from "../store/ws.store.public";
import { wsStorage as privateWsStorage } from "../store/ws.store.private";
import {
  onSocketConnectedEvent,
  onSocketDisconnectedEvent,
  SocketConnectedListener,
  SocketDisconnectedListener,
} from "../events/ws.events";

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

  const showServerNotStartedWarn = () => {
    warn(`Websocket - Server is not started`);
  };
  let waitIstanbulHttp: boolean = false;
  return {
    config: config,
    context: undefined,
    mainNamespace: mainNamespace,
    ...createMiddlewareImplementer(mainNamespace.middlewares),
    ...createListenerCreator(mainNamespace.listeners),
    of: createNamespace,
    close() {
      if (this.context) this.context.close();
      else showServerNotStartedWarn();
      return this;
    },
    onSocketConnect(listener: SocketConnectedListener): WsApp {
      onSocketConnectedEvent.addListener(listener);
      return this;
    },
    onSocketDisconnect(listener: SocketDisconnectedListener): WsApp {
      onSocketDisconnectedEvent.addListener(listener);
      return this;
    },
    bindHttpServer(): OnServerStartedEvent {
      waitIstanbulHttp = true;
      return (server) => {};
    },
    build(): CorePlugin {
      const getHttpInstance = async (
        corePlugins: Map<string, CorePlugin>
      ): Promise<HttpServerForWs | undefined> => {
        return new Promise((resolve, reject) => {
          if (corePlugins.has("http")) {
            const httpApp = corePlugins.get("http");
            if (!httpApp || !httpApp.onStarted) return resolve(undefined);
            httpApp.onStarted((httpApp, providers) => {
              const instance = providers!.get("instance");
              if (!instance)
                return reject(new Error("Http instance not found"));
              return resolve(instance);
            });
          } else resolve(undefined);
        });
      };

      return {
        name: "ws",
        version: "1.0.0",
        install: async (
          app: App,
          corePlugins: Map<string, CorePlugin>
        ): Promise<void> => {
          privateWsStorage.provide(
            PrivateWsStoreKeys.ErrorHandler,
            this.config.errorHandler
          );
          const corsMiddleware = app.store.inject(
            "istanbuljs:cors-ws-middleware",
            true
          );
          httpServer = waitIstanbulHttp
            ? await getHttpInstance(corePlugins)
            : httpServer;
          this.context = new Server(httpServer, {
            path: this.config.prefix,
            serveClient: this.config.serveClient,
            connectTimeout: this.config.connectTimeout,
            cors: !!corsMiddleware ? null : this.config.cors,
          });
          if (this.config.adapter) {
            this.context.adapter(this.config.adapter);
          }
          if (corsMiddleware) {
            this.context.engine.corsMiddleware = (
              options: any,
              req: IncomingMessage,
              res: ServerResponse,
              next: Function
            ) => {
              return corsMiddleware(req, res, next);
            };
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
