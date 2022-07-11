import { UniqueSet } from "@istanbul/core";
import { NextFunction, Socket } from "../types/types";

export type GlobalMiddleware = (socket: Socket, next: NextFunction) => any;

export interface MiddlewareImplementer {
  use(middleware: GlobalMiddleware): void;
}

export interface MiddlewareStorage {
  middlewares: UniqueSet<GlobalMiddleware>;
}
