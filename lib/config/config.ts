import { ErrorEventHandler } from "../types/types";

export interface WebsocketConfig {
  /**
   * @default "/ws/"
   * @description It is the name of the path that is captured on the server side. More: https://socket.io/docs/v4/server-options/#path
   * @author Sami Salih İBRAHİMBAŞ
   * @since 0.0.1
   * */
  prefix: string;

  /**
   * @default false
   * @description Whether to serve the client files or not. More: https://socket.io/docs/v4/server-options/#serveclient
   * @author Sami Salih İBRAHİMBAŞ
   * @since 0.0.1
   * */
  serveClient: boolean;

  /**
   * @default 45000
   * @description The number of ms before disconnecting a client that has not successfully joined a namespace. More: https://socket.io/docs/v4/server-options/#connecttimeout
   * @author Sami Salih İBRAHİMBAŞ
   * @since 0.0.1
   * */
  connectTimeout: number;

  /**
   * @default 3000
   * @description Server port
   * @author Sami Salih İBRAHİMBAŞ
   * @since 0.0.1
   * */
  port: number;

  /**
   * @default @
   * @description listener version separator
   * @author Sami Salih İBRAHİMBAŞ
   * @since 0.0.1
   * */
  versionSeparator: string;

  cors: any;

  errorHandler?: ErrorEventHandler;
}
