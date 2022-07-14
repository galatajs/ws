import { createInjector } from "@istanbul/inject";

export enum WsStoreKeys {
  context = "istanbul/context",
}

export const wsStore = createInjector();
