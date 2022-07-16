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
    let method: string = "on";
    const params: Array<any> = [];
    const handler = (...args) => {
      createListenerStack({
        args: args,
        listener: listener,
        socket: socket,
      }).next();
    };
    if (listener.buildName() === "*") {
      method = "onAny";
    } else if (listener.buildName() === "<*") {
      method = "prependAny";
    } else {
      params.push(listener.buildName());
    }
    socket[method](...params, handler);
  });
};

export const createWsService = (mainNamespace: MainNamespace): WsService => {
  return {
    context: undefined,
    mainNamespace: undefined,
    mount(
      context: WsServer,
      mainNamespace: MainNamespace,
      connectOnMount: boolean
    ): WsService {
      this.context = context;
      this.mainNamespace = mainNamespace;
      this.deployNamespaces();
      this.deployMiddlewares();
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
      this.mainNamespace!.middlewares.forEach((middleware) => {
        this.context!.use(middleware);
      });
      return this;
    },
    deployNamespaces(): WsService {
      mainNamespace.namespaces.forEach((namespace) => {
        const ns = this.context!.of(namespace.buildName());
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
