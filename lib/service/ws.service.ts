import { GlobalMiddleware } from "../middleware/global.middleware";
import { MainNamespace } from "../namespace/namespace";
import { Socket, WsServer } from "../types/types";

export interface WsService {
  context?: WsServer;
  listening: boolean;
  mainNamespace?: MainNamespace;
  mount(
    context: WsServer,
    mainNamespace: MainNamespace,
    connectOnMount: boolean
  ): this;
  connect(connectOnMount: boolean): this;
  deployListeners(socket: Socket): this;
  deployMiddlewares(): this;
  deployNamespaces(): this;
  addDynamicMiddleware(middleware: GlobalMiddleware): this;
}

export interface WsEventService {
  deployListeners(socket: Socket): this;
  deployMiddlewares(): this;
  deploy(): this;
}
