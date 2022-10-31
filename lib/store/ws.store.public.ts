import { createInjector } from "@galatajs/inject";

export enum WsStoreKeys {
  context = "galatajs/context",
}

export const wsStore = createInjector();
