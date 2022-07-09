export interface Response {
  success(message: string): void;
  error(message: string, code?: number): void;
  successData<T>(message: string, data: T): void;
  errorData<T>(message: string, data: T, code?: number): void;
  notFound(message: string): void;
  badRequest(message: string): void;
  serverError(message: string): void;
  send<T>(data?: T): void;
  done<T>(data?: T): void;
  reply<T>(data?: T): void;
}
