import { UniqueSet } from "@istanbul/core";
import { Listener } from "../listener/listener";
import { GlobalMiddleware } from "../middleware/global.middleware";
import {
  MainNamespace,
  Namespace,
  NamespaceProps,
} from "../namespace/namespace";
import { createListenerCreator } from "./listener.hooks";
import { createMiddlewareImplementer } from "./middleware.hooks";

export const createNamespace = (props: NamespaceProps): Namespace => {
  const listeners = new UniqueSet<Listener>();
  const middlewares = new UniqueSet<GlobalMiddleware>();
  return {
    path: props.path,
    version: props.version,
    listeners: listeners,
    ...createMiddlewareImplementer(),
    middlewares: middlewares,
    ...createListenerCreator(listeners),
  };
};

export const createMainNamespace = (): MainNamespace => {
  return {
    listeners: new UniqueSet<Listener>(),
    middlewares: new UniqueSet<GlobalMiddleware>(),
    namespaces: new UniqueSet<Namespace>(),
  };
};
