import { WsApp } from "../app/ws.app";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { Server as HTTPSServer } from "https";
import { CorePlugin } from "@istanbul/app";

export const createWsApp = (httpServer: HttpServer | HTTPSServer): WsApp => {
  return {
    config: {
      prefix: "/ws/",
      serveClient: false,
      connectTimeout: 45000,
      adapter: undefined,
      parser: undefined,
    },
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
        },
      };
    },
  };
};
