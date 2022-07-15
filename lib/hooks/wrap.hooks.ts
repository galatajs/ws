import { transformHttpRequest } from "../request/request.transformer";
import { Socket } from "socket.io";
import { GlobalMiddleware } from "../middleware/global.middleware";
import {
  HttpMiddleware,
  HttpMiddlewareWrapper,
  NextFunction,
} from "../types/types";

export const wrapHttpMiddleware: HttpMiddlewareWrapper = (
  middleware: HttpMiddleware
): GlobalMiddleware => {
  return (socket: Socket, next: NextFunction): any => {
    return middleware(transformHttpRequest(socket.request), {}, next);
  };
};
