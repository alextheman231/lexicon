import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

function handleFallthroughMiddleware<
  ParameterType extends ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  middleware: RequestHandler<ParameterType, ResBody, ReqBody, ReqQuery, Locals>,
): RequestHandler<ParameterType, ResBody, ReqBody, ReqQuery, Locals> {
  return async (request, response, next) => {
    try {
      await middleware(request, response, () => {});
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default handleFallthroughMiddleware;
