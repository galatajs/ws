import { Http2ServerRequest } from "http2";
import { IncomingMessage } from "http";
import { Getter } from "../types/types";

export type CookieSetterParams = string[] | string;
export type CookieGetterResult = CookieSetterParams | undefined;

export type CookieGetter = Getter<CookieGetterResult>;

export const getCookie = (
  req: IncomingMessage | Http2ServerRequest,
  key: string
): CookieGetterResult => {
  return req.headers["cookie"]
    ?.split(";")
    .find((cookie) => cookie.includes(`${key}=`))
    ?.split("=")[1];
};
