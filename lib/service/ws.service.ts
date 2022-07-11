import { WsServer } from "../types/types";

export interface WsService {
  context?: WsServer;
  mount(context: WsServer, connectOnMount: boolean): this;
  connect(connectOnMount: boolean): this;
  disconnect(): this;
  deployListeners(): this;
  deployMiddlewares(): this;
  deployNamespaces(): this;
  mountMiddlewares(): this;
}
