import { HttpMethods } from "./../types/types";
import { WebsocketConfig } from "../config/config";
import { wsStorage } from "../store/ws.store.private";
import { WsStoreKeys } from "../store/ws.store-keys";
import { WebsocketConfigParams } from "../types/config.params";

const defaultConfig: WebsocketConfig = {
  prefix: "/ws/",
  serveClient: false,
  connectTimeout: 45000,
  port: 3000,
  versionSeparator: ".",
  cors: {
    origin: "*",
    methods: [
      HttpMethods.GET,
      HttpMethods.POST,
      HttpMethods.PUT,
      HttpMethods.DELETE,
      HttpMethods.OPTIONS,
      HttpMethods.PATCH,
      HttpMethods.HEAD,
    ],
  },
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
