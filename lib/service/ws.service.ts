import { WsServer } from "../types/types";

export interface WsService {
  context?: WsServer;
  mount(context: WsServer, connectOnMount: boolean): this;
  connect(): this;
  disconnect(): this;
  deployListeners(): this;
  deployMiddlewares(): this;
  deployNamespaces(): this;
}
