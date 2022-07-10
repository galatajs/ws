import { Socket } from "socket.io";
import { WebsocketConfig } from "../app/ws.app";
import { WsService } from "../service/ws.service";
import { WsServer } from "../types/types";

export const createWsService = (config: WebsocketConfig): WsService => {
  return {
    context: undefined,
    mount(context: WsServer, connectOnMount: boolean): WsService {
      this.context = context;
      if (connectOnMount) this.connect();
      return this;
    },
    deployListeners(): WsService {
      this.context?.on("connection", (socket: Socket) => {});
      return this;
    },
    connect(): WsService {
      this.context!.listen(config.port);
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
