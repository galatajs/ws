import {
  isWebsocketParams,
  WebsocketConfigParams,
} from "../types/config.params";
import { WebsocketConfig, WsApp } from "../app/ws.app";
import { Server } from "socket.io";
import { CorePlugin } from "@istanbul/app";
import { HttpServerForWs } from "../types/types";
import { createConfig } from "./config.hooks";
import { Listener } from "../listener/listener";
import { GlobalMiddleware } from "../middleware/global.middleware";
import { UniqueSet } from "@istanbul/core";
import { createWsService } from "./service.hooks";

export const createWsApp = (
  httpServer?:
    | HttpServerForWs
    | (WebsocketConfigParams & { server: HttpServerForWs })
): WsApp => {
  const config: WebsocketConfig = createConfig(
    isWebsocketParams(httpServer) ? httpServer : undefined
  );
  const listeners = new UniqueSet<Listener>();
  const middlewares = new UniqueSet<GlobalMiddleware>();
  const service = createWsService(config);

  return {
    config: config,
    context: undefined,
    use(middleware: GlobalMiddleware): WsApp {
      middlewares.add(middleware);
      return this;
    },
    build(): CorePlugin {
      return {
        name: "ws",
        version: "1.0.0",
        onAppStarted(hook) {},
        install: () => {
          this.context = new Server(httpServer, {
            path: this.config.prefix,
            serveClient: this.config.serveClient,
            adapter: this.config.adapter,
            parser: this.config.parser,
            connectTimeout: this.config.connectTimeout,
          });
          service.mount(this.context, !!!httpServer);
        },
      };
    },
  };
};
