import { CorePluginCreator } from "@galatajs/app";
import { HttpServerForWs, OnServerStartedEvent } from "../types/types";
import { NamespaceCreator } from "../namespace/namespace";
import { WebsocketConfig } from "../config/config";
import { ListenerCreator } from "../listener/listener";
import { MiddlewareImplementer } from "../middleware/global.middleware";
import { MainNamespace } from "../namespace/namespace";
import { WsServer } from "../types/types";
import { WebsocketConfigParams } from "../types/config.params";
import {
  SocketConnectedListener,
  SocketDisconnectedListener,
} from "../events/ws.events";

export interface WsApp
  extends CorePluginCreator,
    MiddlewareImplementer,
    ListenerCreator {
  config: WebsocketConfig;
  mainNamespace: MainNamespace;
  context?: WsServer;
  of: NamespaceCreator;
  close(): this;
  onSocketConnect(listener: SocketConnectedListener): this;
  onSocketDisconnect(listener: SocketDisconnectedListener): this;
  bindHttpServer(): OnServerStartedEvent;
}

export type WsAppCreator = {
  (server?: HttpServerForWs): WsApp;
  (params?: WebsocketConfigParams & { server?: HttpServerForWs }): WsApp;
};
