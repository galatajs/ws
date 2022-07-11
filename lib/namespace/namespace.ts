import { UniqueSet } from "@istanbul/core";
import { ListenerCreator, ListenerStorage } from "../listener/listener";
import {
  MiddlewareImplementer,
  MiddlewareStorage,
} from "../middleware/global.middleware";

export type NamespaceProps = {
  path: string;
  version?: number;
};

export interface Namespace
  extends MiddlewareImplementer,
    ListenerCreator,
    ListenerStorage,
    MiddlewareStorage {
  path: string;
  version?: number;
}

export interface NamespaceStorage {
  namespaces: UniqueSet<Namespace>;
}

export interface MainNamespace
  extends ListenerStorage,
    MiddlewareStorage,
    NamespaceStorage {}
