import { GlobalMiddleware } from "../middleware/global.middleware";

export type NamespaceProps = {
  path: string;
  version?: number;
};

export interface Namespace {
  path: string;
  version?: number;
  use(middleware: GlobalMiddleware): this;
}
