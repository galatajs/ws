import { createEvent } from "@istanbul/events";
import { Socket } from "socket.io";

export const onConnection = createEvent<Socket>("connection");
export const onDisconnection = createEvent<Socket>("disconnection");
