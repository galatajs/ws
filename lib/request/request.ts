import { IncomingMessage } from "http";
import { Http2ServerRequest } from "http2";
import { Modify } from "../types/types";
import { HeaderGetter } from "./request.header";

export interface BaseRequest {
  ip: string;
  body: Record<string, any>;
  params: Record<string, any>;
  cookies: any;
  query: Record<string, any>;
  headers: HeaderGetter;
}
type Http1BaseRequest = Modify<IncomingMessage, BaseRequest>;
type Http2BaseRequest = Modify<Http2ServerRequest, BaseRequest>;

export interface Http1Request extends Http1BaseRequest {}
export interface Http2Request extends Http2BaseRequest {}

export type Request = Http1Request | Http2Request;
