import { MainNamespace } from "../namespace/namespace";
import { Socket, WsServer } from "../types/types";

export interface WsService {
  context?: WsServer;
  mount(context: WsServer, mainNamespace: MainNamespace, connectOnMount: boolean): this;
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
