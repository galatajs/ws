import { Socket as SocketioSocket } from "socket.io";
import { Response } from "../response/response";
import { Request as ParsedRequest } from "../request/request";
import { Server as HttpServer } from "http";
import { Server as HTTPSServer } from "https";
import { Server as SocketIoServer } from "socket.io";
import { GlobalMiddleware } from "../middleware/global.middleware";

export type Socket = SocketioSocket;
export type EventHandler = (socket: Socket, req: Request, res: Response) => any;
export type NextFunction = (err?: any) => any;
export type Request = {
  body: any;
};
export type HttpServerForWs = HttpServer | HTTPSServer;
export type WsServer = SocketIoServer;

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
}

export type HttpMiddleware = (
  req: ParsedRequest,
  res: any,
  next: NextFunction
) => any;
export type HttpMiddlewareWrapper = (
  middleware: HttpMiddleware
) => GlobalMiddleware;
export type Getter<T> = {
  get(key: string): T;
};
export type Modify<T, R> = Omit<T, keyof R> & R;
