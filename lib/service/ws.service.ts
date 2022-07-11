import { Socket, WsServer } from "../types/types";

export interface WsService {
  context?: WsServer;
  mount(context: WsServer, connectOnMount: boolean): this;
  connect(connectOnMount: boolean): this;
  deployListeners(socket: Socket): this;
  deployMiddlewares(): this;
  deployNamespaces(): this;
}

export interface WsEventService {
  deployListeners(socket: Socket): this;
  deployMiddlewares(): this;
  deploy(): this;
}
