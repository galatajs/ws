import { UniqueSet } from "@istanbul/core";
import {
  GlobalMiddleware,
  MiddlewareImplementer,
} from "../middleware/global.middleware";
import { NextFunction, Socket } from "../types/types";

const wrapGlobalMiddleware = (
  middleware: GlobalMiddleware
): GlobalMiddleware => {
  return async (socket: Socket, next: NextFunction): Promise<void> => {
    try {
      await middleware(socket, next);
    } catch (e: any) {
      next(e);
    }
  };
};

export const createMiddlewareImplementer = (
  middlewares: UniqueSet<GlobalMiddleware>
): MiddlewareImplementer => {
  return {
    use(middleware: GlobalMiddleware) {
      middlewares.add(wrapGlobalMiddleware(middleware));
    },
  };
};
