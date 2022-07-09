import { InternalMiddleware } from "../middleware/internal.middleware";
import { EventHandler } from "../types/types";

export interface Listener {
  name: string;
  version?: number;
  middlewares: InternalMiddleware[];
  handler: EventHandler;
}
