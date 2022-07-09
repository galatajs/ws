import {
  isWebsocketParams,
  WebsocketConfigParams,
} from "../types/config.params";
import { WebsocketConfig, WsApp } from "../app/ws.app";
import { Server } from "socket.io";
import { CorePlugin } from "@istanbul/app";
import { HttpServerForWs } from "../types/types";
import { createConfig } from "./config.hooks";

export const createWsApp = (
  httpServer?:
    | HttpServerForWs
    | (WebsocketConfigParams & { server: HttpServerForWs })
): WsApp => {
  const config: WebsocketConfig = createConfig(
    isWebsocketParams(httpServer) ? httpServer : undefined
  );

  return {
    config: config,
    context: undefined,
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
          this.context.on("connection", (socket) => {
            console.log("socket -> ", socket);
          });
          if (!httpServer) {
            this.context.listen(3000);
          }
        },
      };
    },
  };
};
