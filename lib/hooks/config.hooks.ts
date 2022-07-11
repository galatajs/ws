import { WebsocketConfig } from "../app/ws.app";
import { wsStorage } from "../store/ws.store";
import { WsStoreKeys } from "../store/ws.store-keys";
import { WebsocketConfigParams } from "../types/config.params";

const defaultConfig: WebsocketConfig = {
  prefix: "/ws/",
  serveClient: false,
  connectTimeout: 45000,
  adapter: undefined,
  parser: undefined,
  port: 3000,
  versionSeparator: "@",
};

export const createConfig = (
  config?: WebsocketConfigParams
): WebsocketConfig => {
  const _config = {
    ...defaultConfig,
    ...config,
  };
  wsStorage.provide(WsStoreKeys.Config, _config);
  return _config;
};
