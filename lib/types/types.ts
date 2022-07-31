import { Server as HttpServer } from "node:http";
import { Server as HTTPSServer } from "node:https";
import { Http2Server } from "node:http2";
import {
  Socket as SocketioSocket,
  Server as SocketIoServer,
  Namespace as SocketioNamespace,
} from "socket.io";
import { Response } from "../response/response";
import { Request as ParsedRequest } from "../request/request";
import { GlobalMiddleware } from "../middleware/global.middleware";

export type Socket = SocketioSocket;
export type EventHandler = (
  socket: Socket,
  req: SocketRequest,
  res: Response
) => any;
export type NextFunction = (err?: any) => any;
export type ErrorEventHandler = (
  err: any,
  socket: Socket,
  req: SocketRequest,
  res: Response
) => any;
export type Request = {
  body: any;
};
export type SocketRequest = Request & ParsedRequest;
export type HttpServerForWs = HttpServer | HTTPSServer;
export type WsServer = SocketIoServer;
export type WsNamespace = SocketioNamespace;

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

export type OnServerStartedEvent = (server: HttpServer | Http2Server) => void;
