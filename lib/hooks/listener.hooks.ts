import { UniqueSet } from "@istanbul/core";
import { Listener } from "../listener/listener";

const listeners = new UniqueSet<Listener>();

export const createListener = (listener: Listener): void => {
  listeners.add(listener);
};
