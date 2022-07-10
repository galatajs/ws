import { Socket } from "socket.io";
import { NextFunction } from "../types/types";

export type GlobalMiddleware = (socket: Socket, next: NextFunction) => any;
