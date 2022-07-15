import {
  NamespaceCreator,
  NamespaceImplementer,
} from "./../namespace/namespace";
import { UniqueSet } from "@istanbul/core";
import { WebsocketConfig } from "../config/config";
import { Listener } from "../listener/listener";
import { GlobalMiddleware } from "../middleware/global.middleware";
import {
  MainNamespace,
  Namespace,
  NamespaceProps,
} from "../namespace/namespace";
import { WsStoreKeys } from "../store/ws.store-keys";
import { wsStorage } from "../store/ws.store.private";
import { createListenerCreator } from "./listener.hooks";
import { createMiddlewareImplementer } from "./middleware.hooks";

const parseProps = (props: NamespaceProps | string): NamespaceProps => {
  if (typeof props === "string") {
    return {
      path: props,
    };
  }
  return props;
};

export const createNamespace: NamespaceCreator = (
  props: NamespaceProps | string,
  version?: number
): Namespace => {
  const listeners = new UniqueSet<Listener>();
  const middlewares = new UniqueSet<GlobalMiddleware>();
  const _props = parseProps(props);
  return {
    path: _props.path,
    version: _props.version || version,
    buildName() {
      const config = wsStorage.inject(WsStoreKeys.Config) as WebsocketConfig;
      return `/${this.path}${
        this.version ? `${config.versionSeparator}${this.version}` : ""
      }`;
    },
    listeners: listeners,
    middlewares: middlewares,
    ...createListenerCreator(listeners),
    ...createMiddlewareImplementer(middlewares),
  };
};

export const createMainNamespace = (): MainNamespace => {
  return {
    listeners: new UniqueSet<Listener>(),
    middlewares: new UniqueSet<GlobalMiddleware>(),
    namespaces: new UniqueSet<Namespace>(),
  };
};

export const createNamespaceImplementer = (
  namespaces: UniqueSet<Namespace>
): NamespaceImplementer => {
  return {
    register(namespace: Namespace) {
      namespaces.add(namespace);
    },
  };
};
