import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import { az } from "@alextheman/utility";
import z from "zod";

import { getConnection } from "src/database/connection";
import selectUser from "src/models/users/selectUser";
import selectUserSession from "src/models/userSessions/selectUserSession";

function handleEndpointMiddleware<
  ParameterType extends ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends object = Record<string, unknown>,
>(
  middleware: RequestHandler<ParameterType, ResBody, ReqBody, ReqQuery, Locals>,
): RequestHandler<ParameterType, ResBody, ReqBody, ReqQuery, Locals> {
  return async (request, response, next) => {
    const connection = getConnection();
    const sessionId = request.cookies.session;
    const session = await selectUserSession(connection, sessionId);

    const currentUser = session !== null ? await selectUser(connection, session) : null;
    request.user =
      currentUser !== null
        ? {
            ...currentUser,
            dateOfBirth: az.with(z.coerce.date().nullable()).parse(currentUser.dateOfBirth),
          }
        : null;

    Promise.resolve(middleware(request, response, next)).catch(next);
  };
}

export default handleEndpointMiddleware;
