import { Namespace } from "socket.io";
import { Adapter } from "socket.io-adapter";

export type AdapterConstructor = typeof Adapter | ((nsp: Namespace) => Adapter);
