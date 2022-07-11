import { NextFunction, Request, Socket } from "../types/types";
import { Response } from "../response/response";

export type InternalMiddleware = (
  socket: Socket,
  req: Request,
  res: Response,
  next: NextFunction
) => any;
