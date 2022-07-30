import { Http2ServerRequest } from "http2";
import { IncomingMessage } from "http";
import url from "node:url";
import { getHead, HeaderGetterResult } from "./request.header";
import { Request } from "./request";

export const transformHttpRequest = (
  req: IncomingMessage | Http2ServerRequest
): Request => {
  const query = { ...url.parse(req.url || "", true).query };
  req.url = req.url?.split("?")[0];
  return {
    ...req,
    ip: req.socket.remoteAddress || "0.0.0.0",
    params: {},
    body: {},
    query: query,
    cookie: {},
    header: {
      get(key: string): HeaderGetterResult {
        return getHead(req, key);
      },
    },
  } as Request;
};
