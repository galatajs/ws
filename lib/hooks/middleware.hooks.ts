import {
  GlobalMiddleware,
  MiddlewareImplementer,
} from "../middleware/global.middleware";

export const createMiddlewareImplementer = (): MiddlewareImplementer => {
  return {
    use(middleware: GlobalMiddleware) {},
  };
};
