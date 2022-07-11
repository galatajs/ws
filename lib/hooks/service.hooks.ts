import { UniqueSet } from "@istanbul/core";
import { Socket } from "socket.io";
import { WebsocketConfig } from "../app/ws.app";
import { GlobalMiddleware } from "../middleware/global.middleware";
import { WsService } from "../service/ws.service";
import { WsServer } from "../types/types";

export const createWsService = (
  config: WebsocketConfig,
  globalMiddlewares: UniqueSet<GlobalMiddleware>
): WsService => {
  return {
    context: undefined,
    mount(context: WsServer, connectOnMount: boolean): WsService {
      this.context = context;
      this.mountMiddlewares()
        .deployNamespaces()
        .deployListeners()
        .connect(connectOnMount);
      return this;
    },
    mountMiddlewares(): WsService {
      globalMiddlewares.forEach((middleware) => {
        this.context!.use(middleware);
      });
      return this;
    },
    deployListeners(): WsService {
      this.context!.on("connection", (socket: Socket) => {});
      return this;
    },
    connect(connectOnMount: boolean): WsService {
      if (connectOnMount) this.context!.listen(config.port);
      return this;
    },
    disconnect(): WsService {
      return this;
    },
    deployMiddlewares(): WsService {
      return this;
    },
    deployNamespaces(): WsService {
      return this;
    },
  };
};
