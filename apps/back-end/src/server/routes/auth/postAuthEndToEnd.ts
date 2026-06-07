import type { Router } from "express";

import { APIError } from "@alextheman/utility/v6";
import { parseEndToEndAuthInsertData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import selectUser from "src/models/users/selectUser";
import COOKIES from "src/server/routes/auth/helpers/COOKIES";
import createUserSession from "src/services/userSessions/createUserSession";
import allowEnvironments from "src/utility/handlers/allowEnvironments";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

function postAuthEndToEnd(auth: Router) {
  auth.post(
    "/end-to-end",
    allowEnvironments(["development", "end-to-end"]),
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      const session = await connection.transaction(async (transaction) => {
        const { email } = parseEndToEndAuthInsertData(request.body);

        const user = await selectUser(transaction, { email });

        if (user === null) {
          throw new APIError(
            404,
            "USER_NOT_FOUND",
            "The user could not be found in the development database. If you wish to test with the provided credentials, please add it to `dev/fixtures`.",
          );
        }

        const session = await createUserSession(transaction, { userId: user.id });

        return session;
      });

      response.cookie("session", session.id, {
        ...COOKIES,
        expires: session.expiresAt,
      });

      response.status(204).send({});
    }),
  );
}

export default postAuthEndToEnd;
