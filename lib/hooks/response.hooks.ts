import {
  ErrorDataResult,
  ErrorResult,
  Status,
  SuccessDataResult,
  SuccessResult,
} from "@galatajs/core";
import { Response } from "../response/response";

export const createResponseInstance = (callback?: Function): Response => {
  return {
    success(message: string): void {
      this.done<SuccessResult>(new SuccessResult(message));
    },
    error(message: string, code: number = Status.BAD_REQUEST): void {
      this.done<ErrorResult>(new ErrorResult(message, code));
    },
    successData<T>(message: string, data: T): void {
      this.done<SuccessDataResult<T>>(new SuccessDataResult<T>(message, data));
    },
    errorData<T>(
      message: string,
      data: T,
      code: number = Status.BAD_REQUEST
    ): void {
      this.done<ErrorDataResult<T>>(
        new ErrorDataResult<T>(message, data, code)
      );
    },
    done<T>(data: T & { code?: number; status?: number }): void {
      if (callback) {
        callback(data);
      }
    },
    badRequest(message: string) {
      this.error(message, Status.BAD_REQUEST);
    },
    notFound(message: string) {
      this.error(message, Status.NOT_FOUND);
    },
    serverError(message: string) {
      this.error(message, Status.INTERNAL_SERVER_ERROR);
    },
    send<T>(data?: T) {
      this.done<T>(data);
    },
    reply<T>(data?: T) {
      this.done<T>(data);
    },
  };
};
