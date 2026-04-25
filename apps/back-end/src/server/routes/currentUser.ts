import type { UserProfileData } from "@lexicon/models";
import type { ParamsDictionary } from "express-serve-static-core";

import { parseUser } from "@lexicon/models";
import { Router } from "express";

import { getConnection } from "src/database/connection";
import { selectUser, updateUserProfile } from "src/services/users";
import { selectUserSession } from "src/services/userSessions";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";
import requireAuth from "src/utility/validators/requireAuth";

const currentUserRouter = Router();

currentUserRouter.get(
  "/",
  handleEndpointMiddleware(async (request, response) => {
    const connection = getConnection();
    const sessionId = request.cookies.session;

    if (!sessionId) {
      return response.status(200).send({ user: null });
    }

    const session = await selectUserSession(connection, sessionId);

    if (session === null || session.expiresAt < new Date()) {
      response.clearCookie("session");
      return response.status(200).send({ user: null });
    }

    const user = parseUser(await selectUser(connection, session.userId));
    return response.status(200).send({ user });
  }),
);

currentUserRouter.put(
  "/profile",
  requireAuth,
  handleEndpointMiddleware<ParamsDictionary, unknown, UserProfileData>(
    async (request, response) => {
      const connection = getConnection();
      const user = parseUser(request.user);
      await updateUserProfile(connection, user.id, request.body);
      response.status(200).send({});
    },
  ),
);

export default currentUserRouter;
