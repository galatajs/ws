import { UniqueSet } from "@galatajs/core";
import { ListenerCreator, ListenerStorage } from "../listener/listener";
import {
  MiddlewareImplementer,
  MiddlewareStorage,
} from "../middleware/global.middleware";
import { WsNamespace } from "../types/types";

export type NamespaceProps = {
  path: string;
  version?: number;
};

export interface Namespace
  extends MiddlewareImplementer,
    ListenerCreator,
    ListenerStorage,
    MiddlewareStorage {
  context?: WsNamespace;
  path: string;
  version?: number;
  buildName(): string;
}

export interface NamespaceStorage {
  namespaces: UniqueSet<Namespace>;
}

export interface MainNamespace
  extends ListenerStorage,
    MiddlewareStorage,
    NamespaceStorage {}

export type NamespaceImplementer = {
  register(namespace: Namespace): void;
};

export type NamespaceCreator = {
  (props: NamespaceProps): Namespace;
  (path: string, version?: number): Namespace;
};
