import { CorePluginCreator } from "@istanbul/app";
import { WebsocketConfig } from "../config/config";
import { ListenerCreator } from "../listener/listener";
import { MiddlewareImplementer } from "../middleware/global.middleware";
import { MainNamespace } from "../namespace/namespace";
import { WsServer } from "../types/types";

export interface WsApp
  extends CorePluginCreator,
    MiddlewareImplementer,
    ListenerCreator {
  config: WebsocketConfig;
  mainNamespace: MainNamespace;
  context?: WsServer;
}
