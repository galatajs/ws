import { UniqueSet } from "@istanbul/core";
import {
  GlobalMiddleware,
  MiddlewareImplementer,
} from "../middleware/global.middleware";

export const createMiddlewareImplementer = (
  middlewares: UniqueSet<GlobalMiddleware>
): MiddlewareImplementer => {
  return {
    use(middleware: GlobalMiddleware) {
      middlewares.add(middleware);
    },
  };
};
