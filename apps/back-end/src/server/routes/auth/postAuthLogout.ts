import type { Router } from "express";

import { getConnection } from "src/database/connection";
import expireUserSession from "src/services/userSessions/mutations/transaction/expireUserSession";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";
import msToMinutes from "src/utility/timeConverters/msToMinutes";

function postAuthLogout(auth: Router) {
  auth.post(
    "/logout",
    handleRateLimit({
      limit: 10,
      windowMs: msToMinutes(15),
    }),
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const sessionId = request.cookies.session;

      if (!sessionId) {
        return response.status(204).send({});
      }

      response.clearCookie("session");

      await connection.transaction(async (transaction) => {
        await expireUserSession(transaction, sessionId);
        response.status(204).send({});
      });
    }),
  );
}

export default postAuthLogout;
