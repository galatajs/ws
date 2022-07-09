import { Socket } from "socket.io";
import { Response } from "../response/response";
import { Server as HttpServer } from "http";
import { Server as HTTPSServer } from "https";

export type EventHandler = (
  socket: Socket,
  req: Request,
  res: Response,
  next: NextFunction
) => any;
export type NextFunction = () => any;
export type Request = any;
export type HttpServerForWs = HttpServer | HTTPSServer;