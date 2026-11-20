import type { Router } from "express";

import { secondsToMs } from "@alextheman/utility";
import { EmailIdent, parseCreateUserData, UserState } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import createEmail from "src/services/emails/createEmail";
import createUser from "src/services/users/createUser";
import APIError from "src/utility/errors/APIError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function postUser(users: Router) {
  users.post(
    "/",
    handleRateLimit({
      limit: 5,
      windowMs: secondsToMs(10),
    }),
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      const data = parseCreateUserData(request.body);

      const today = new Date();
      const minimumDateOfBirth = new Date(today);
      minimumDateOfBirth.setFullYear(today.getFullYear() - 13);

      if (data.dateOfBirth > minimumDateOfBirth) {
        throw new APIError(
          400,
          "INVALID_AGE",
          "You must be at least 13 years old to create an account.",
        );
      }

      await connection.transaction(async (transaction) => {
        const user = await createUser(transaction, { ...data, state: UserState.UNVERIFIED });
        await createEmail(transaction, {
          ident: EmailIdent.COMPLETE_SIGN_UP,
          recipientId: user.id,
          sentAt: null,
          context: {
            username: user.displayName ?? user.username,
          },
        });
        response.status(201).send({ id: user.id });
      });
    }),
  );
}

export default postUser;
