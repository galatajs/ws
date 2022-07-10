import { Socket } from "socket.io";
import { Response } from "../response/response";
import { Server as HttpServer } from "http";
import { Server as HTTPSServer } from "https";
import { Server as SocketIoServer } from "socket.io";

export type EventHandler = (
  socket: Socket,
  req: Request,
  res: Response,
  next: NextFunction
) => any;
export type NextFunction = (err?: any) => any;
export type Request = any;
export type HttpServerForWs = HttpServer | HTTPSServer;
export type WsServer = SocketIoServer;
