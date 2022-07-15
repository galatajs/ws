import { Getter } from "../types/types";
import { IncomingMessage } from "http";
import { Http2ServerRequest } from "http2";

export type HeaderSetterParams = string[] | string;
export type HeaderGetterResult = HeaderSetterParams | undefined;
export type HeaderGetter = Getter<HeaderGetterResult>;

export const getHead = (
  req: IncomingMessage | Http2ServerRequest,
  key: string
): HeaderGetterResult => {
  return req.headers[key];
};
