import { UniqueSet } from "@galatajs/core";
import {
  GlobalMiddleware,
  MiddlewareImplementer,
} from "../middleware/global.middleware";
import { WsService } from "../service/ws.service";
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
  middlewares: UniqueSet<GlobalMiddleware>,
  wsService?: WsService
): MiddlewareImplementer => {
  return {
    use(middleware: GlobalMiddleware) {
      if (!!wsService) {
        useMiddlewareWithService(wsService, middlewares, middleware);
      } else {
        middlewares.add(wrapGlobalMiddleware(middleware));
      }
    },
  };
};

const useMiddlewareWithService = (
  wsService: WsService,
  middlewares: UniqueSet<GlobalMiddleware>,
  middleware: GlobalMiddleware
) => {
  if (wsService.listening) {
    wsService.addDynamicMiddleware(wrapGlobalMiddleware(middleware));
  } else {
    middlewares.add(wrapGlobalMiddleware(middleware));
  }
};
