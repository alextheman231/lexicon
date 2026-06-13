import type { User } from "@lexicon/models";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import authRequiredError from "src/utility/errors/authRequiredError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

interface AuthenticatedRequest<
  ParameterType extends ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends object = Record<string, unknown>,
> extends Request<ParameterType, ResBody, ReqBody, ReqQuery, Locals> {
  user: User;
}

function handleAuthenticatedEndpointMiddleware<
  ParameterType extends ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends object = Record<string, unknown>,
>(
  middleware: (
    request: AuthenticatedRequest<ParameterType, ResBody, ReqBody, ReqQuery, Locals>,
    response: Response<ResBody, Locals>,
    next: NextFunction,
  ) => unknown,
): RequestHandler<ParameterType, ResBody, ReqBody, ReqQuery, Locals> {
  return handleEndpointMiddleware<ParameterType, ResBody, ReqBody, ReqQuery, Locals>(
    async (request, response, next) => {
      if (request.user === null) {
        throw authRequiredError();
      }
      await middleware(
        request as AuthenticatedRequest<ParameterType, ResBody, ReqBody, ReqQuery, Locals>,
        response,
        next,
      );
    },
  );
}

export default handleAuthenticatedEndpointMiddleware;
