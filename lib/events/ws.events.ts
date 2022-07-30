import { WsServer, Socket } from "../types/types";
import { createEvent } from "@istanbul/events";

export type SocketConnectedListener = (socket: Socket) => void | Promise<void>;
export type SocketDisconnectedListener = (
  socket: Socket
) => void | Promise<void>;

export const onSocketConnectedEvent = createEvent<Socket>("onSocketConnected");
export const onSocketDisconnectedEvent = createEvent<Socket>(
  "onSocketDisconnected"
);
