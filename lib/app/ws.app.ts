import { HttpServerForWs } from "./../types/types";
import { NamespaceCreator, NamespaceImplementer } from "../namespace/namespace";
import { CorePluginCreator } from "@istanbul/app";
import { WebsocketConfig } from "../config/config";
import { ListenerCreator } from "../listener/listener";
import { MiddlewareImplementer } from "../middleware/global.middleware";
import { MainNamespace } from "../namespace/namespace";
import { WsServer } from "../types/types";
import { WebsocketConfigParams } from "../types/config.params";

export interface WsApp
  extends CorePluginCreator,
    MiddlewareImplementer,
    ListenerCreator {
  config: WebsocketConfig;
  mainNamespace: MainNamespace;
  context?: WsServer;
  of: NamespaceCreator;
}

export type WsAppCreator = {
  (server?: HttpServerForWs): WsApp;
  (params?: WebsocketConfigParams & { server?: HttpServerForWs }): WsApp;
};
