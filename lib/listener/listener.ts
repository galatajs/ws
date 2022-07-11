import { UniqueSet } from "@istanbul/core";
import { InternalMiddleware } from "../middleware/internal.middleware";
import { EventHandler } from "../types/types";

export type CreateListenerProps = {
  name: string;
  middlewares: InternalMiddleware[];
  handler: EventHandler;
  versionSeparator: string;
};

export interface Listener {
  name: string;
  version?: number;
  buildName(): string;
  middlewares: InternalMiddleware[];
  handler: EventHandler;
}

export interface ListenerCreator {
  listen(
    name: string,
    middlewares: InternalMiddleware[],
    handler: EventHandler
  ): void;
  listen(name: string, handler: EventHandler): void;
}

export interface ListenerStorage {
  listeners: UniqueSet<Listener>;
}
