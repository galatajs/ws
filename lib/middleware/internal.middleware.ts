import { NextFunction, SocketRequest, Socket } from "../types/types";
import { Response } from "../response/response";

export type InternalMiddleware = (
  socket: Socket,
  req: SocketRequest,
  res: Response,
  next: NextFunction
) => any;
