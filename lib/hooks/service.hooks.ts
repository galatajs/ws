import { ListenerStorage } from "../listener/listener";
import { MainNamespace } from "../namespace/namespace";
import { Namespace as SocketioNamespace } from "socket.io";
import { MiddlewareStorage } from "../middleware/global.middleware";
import { WsEventService, WsService } from "../service/ws.service";
import { WsServer, Socket } from "../types/types";
import { createListenerStack } from "./stack.hooks";
import { wsStorage } from "../store/ws.store.private";
import { WsStoreKeys } from "../store/ws.store-keys";
import { WebsocketConfig } from "../config/config";

const deployListenersWithStorage = (
  listenerStorage: ListenerStorage,
  socket: Socket
): void => {
  listenerStorage.listeners.forEach((listener) => {
    socket.on(listener.buildName(), (...args) => {
      createListenerStack({
        args: args,
        listener: listener,
        socket: socket,
      }).next();
    });
  });
};

export const createWsService = (mainNamespace: MainNamespace): WsService => {
  return {
    context: undefined,
    mount(context: WsServer, connectOnMount: boolean): WsService {
      this.context = context;
      this.deployNamespaces();
      context.on("connection", (socket: Socket) => {
        this.deployListeners(socket);
      });
      this.connect(connectOnMount);
      return this;
    },
    deployListeners(socket: Socket): WsService {
      deployListenersWithStorage(mainNamespace, socket);
      return this;
    },
    deployMiddlewares(): WsService {
      mainNamespace.middlewares.forEach((middleware) => {
        this.context!.use(middleware);
      });
      return this;
    },
    deployNamespaces(): WsService {
      mainNamespace.namespaces.forEach((namespace) => {
        const ns = this.context!.of(namespace.path);
        createEventService(ns, namespace).deploy();
      });
      return this;
    },
    connect(connectOnMount: boolean): WsService {
      const config = wsStorage.inject(WsStoreKeys.Config) as WebsocketConfig;
      if (connectOnMount) this.context!.listen(config.port);
      return this;
    },
  };
};

export const createEventService = (
  context: WsServer | SocketioNamespace,
  storage: ListenerStorage & MiddlewareStorage
): WsEventService => {
  return {
    deploy(): WsEventService {
      this.deployMiddlewares();
      context.on("connection", (socket: Socket) => {
        this.deployListeners(socket);
      });
      return this;
    },
    deployMiddlewares() {
      storage.middlewares.forEach((middleware) => {
        context.use(middleware);
      });
      return this;
    },
    deployListeners(socket: Socket) {
      deployListenersWithStorage(storage, socket);
      return this;
    },
  };
};
