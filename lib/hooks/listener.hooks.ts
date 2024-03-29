import { InternalMiddleware } from "../middleware/internal.middleware";
import { EventHandler } from "../types/types";
import { UniqueSet } from "@galatajs/core";
import {
  CreateListenerProps,
  Listener,
  ListenerCreator,
} from "../listener/listener";
import { wsStorage } from "../store/ws.store.private";
import { WsStoreKeys } from "../store/ws.store-keys";
import { WebsocketConfig } from "../config/config";

export const createListener = (props: CreateListenerProps): Listener => {
  const [name, version] = props.name.split(props.versionSeparator);
  return {
    name: name,
    version: version ? +version : undefined,
    handler: props.handler,
    middlewares: props.middlewares || [],
    buildName(): string {
      return !!this.version
        ? `${this.name}${props.versionSeparator}${this.version}`
        : this.name;
    },
  };
};

export const createListenerCreator = (
  listeners: UniqueSet<Listener>
): ListenerCreator => {
  return {
    listen(
      name: string,
      middlewares: EventHandler | InternalMiddleware[],
      handler?: EventHandler
    ) {
      const config: WebsocketConfig = wsStorage.inject(
        WsStoreKeys.Config
      ) as WebsocketConfig;
      listeners.add(
        createListener({
          name: name,
          middlewares: Array.isArray(middlewares) ? middlewares : [],
          handler: Array.isArray(middlewares) ? handler! : middlewares!,
          versionSeparator: config.versionSeparator,
        })
      );
    },
  };
};
