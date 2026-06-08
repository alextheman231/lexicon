import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

function handleEndpointMiddleware<
  ParameterType extends ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends object = Record<string, unknown>,
>(
  middleware: RequestHandler<ParameterType, ResBody, ReqBody, ReqQuery, Locals>,
): RequestHandler<ParameterType, ResBody, ReqBody, ReqQuery, Locals> {
  return (request, response, next) => {
    Promise.resolve(middleware(request, response, next)).catch(next);
  };
}

export default handleEndpointMiddleware;
