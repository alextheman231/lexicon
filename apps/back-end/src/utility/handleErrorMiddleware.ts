import type { ErrorRequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

function handleErrorMiddleware<
  ParameterType extends ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  middleware: ErrorRequestHandler<ParameterType, ResBody, ReqBody, ReqQuery, Locals>,
): ErrorRequestHandler<ParameterType, ResBody, ReqBody, ReqQuery, Locals> {
  return (error, request, response, next) => {
    Promise.resolve(middleware(error, request, response, next)).catch(next);
    next(error);
  };
}

export default handleErrorMiddleware;
