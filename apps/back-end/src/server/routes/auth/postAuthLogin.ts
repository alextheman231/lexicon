import type { Router } from "express";

import { minutesToMs } from "@alextheman/utility";
import { parseSignInData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import selectUser from "src/models/users/selectUser";
import loadCookies from "src/server/routes/auth/helpers/loadCookies";
import InvalidCredentialsError from "src/services/auth/errors/InvalidCredentialsError";
import verifyPassword from "src/services/auth/verifyPassword";
import createUserSession from "src/services/userSessions/createUserSession";
import APIError from "src/utility/errors/APIError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function postAuthLogin(auth: Router) {
  auth.post(
    "/login",
    handleRateLimit({
      windowMs: minutesToMs(15),
      limit: 10,
    }),
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const COOKIES = loadCookies();

      const data = parseSignInData(request.body, () => {
        return new APIError(400, "INVALID_SIGN_IN_DATA", "The sign-in data is invalid.", {
          input: request.body,
        });
      });

      const session = await connection.transaction(async (transaction) => {
        const user = await selectUser(transaction, { email: data.email });

        if (user === null) {
          throw new InvalidCredentialsError();
        }

        const isPasswordValid = await verifyPassword(transaction, user.id, data.password);

        if (!isPasswordValid) {
          throw new InvalidCredentialsError();
        }

        return await createUserSession(transaction, { userId: user.id });
      });

      response.cookie("session", session.id, {
        ...COOKIES,
        expires: session.expiresAt,
      });

      response.status(200).send({});
    }),
  );
}

export default postAuthLogin;
