import { createEvent } from "@istanbul/events";

export const onConnection = createEvent("connection");
export const onDisconnection = createEvent("disconnection");
