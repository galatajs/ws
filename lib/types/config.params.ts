export type WebsocketConfigParams = {
  prefix?: string;
  serveClient?: boolean;
  connectTimeout?: number;
  adapter?: any;
  parser?: any;
};

export function isWebsocketParams(obj: any): obj is WebsocketConfigParams {
  return (
    obj &&
    (typeof obj.prefix === "string" ||
      typeof obj.serveClient === "boolean" ||
      typeof obj.connectTimeout === "number" ||
      typeof obj.adapter === "object" ||
      typeof obj.parser === "object")
  );
}
