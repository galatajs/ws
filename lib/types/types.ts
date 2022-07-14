import { Socket as SocketioSocket } from "socket.io";
import { Response } from "../response/response";
import { Server as HttpServer } from "http";
import { Server as HTTPSServer } from "https";
import { Server as SocketIoServer } from "socket.io";

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
