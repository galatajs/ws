import { GlobalMiddleware } from "../middleware/global.middleware";
import { Namespace, NamespaceProps } from "../namespace/namespace";

export const createNamespace = (props: NamespaceProps): Namespace => {
  return {
    path: props.path,
    version: props.version,
    use(middleware: GlobalMiddleware): Namespace {
      return this;
    },
  };
};
