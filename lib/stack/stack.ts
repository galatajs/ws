import { Listener } from "../listener/listener";
import { InternalMiddleware } from "../middleware/internal.middleware";
import { Response } from "../response/response";
import { Request, Socket } from "../types/types";

export type CreateListenerStackProps = {
  socket: Socket;
  listener: Listener;
  args: any[];
};

export interface ListenerStack {
  middlewares: Set<InternalMiddleware>;
  res: Response;
  req: Request;
  next: (err?: any) => any;
  done: (result?: any) => any;
  callback?: Function;
}
