import type { Router } from "express";

import { getConnection } from "src/database/connection";
import { expireUserSession } from "src/services/userSessions";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";

function postAuthLogout(auth: Router) {
  auth.post(
    "/logout",
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const sessionId = request.cookies.session;

      if (!sessionId) {
        return response.status(204).send({});
      }

      response.clearCookie("session");
      await expireUserSession(connection, sessionId);
      response.status(204).send({});
    }),
  );
}

export default postAuthLogout;
