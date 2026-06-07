import type { Router } from "express";

import { assertNotNull } from "@alextheman/utility";

import { getConnection } from "src/database/connection";
import selectUser from "src/models/users/selectUser";
import selectUserSession from "src/models/userSessions/selectUserSession";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";

function getCurrentUser(currentUser: Router) {
  currentUser.get(
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

      const user = await selectUser(connection, session);
      assertNotNull(user);
      return response.status(200).send({ user });
    }),
  );
}

export default getCurrentUser;
