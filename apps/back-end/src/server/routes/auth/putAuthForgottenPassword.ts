import type { Router } from "express";

import { minutesToMs } from "@alextheman/utility";
import { EmailIdent, parseForgottenPasswordData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import selectUser from "src/models/users/selectUser";
import createEmail from "src/services/emails/createEmail";
import APIError from "src/utility/errors/APIError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function putAuthForgottenPassword(auth: Router) {
  auth.put(
    "/forgotten-password",
    handleRateLimit({
      limit: 10,
      windowMs: minutesToMs(15),
    }),
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      const data = parseForgottenPasswordData(request.body, () => {
        return new APIError(
          400,
          "INVALID_FORGOTTEN_PASSWORD_DATA",
          "The forgotten password data is invalid.",
          {
            input: request.body,
          },
        );
      });

      await connection.transaction(async (transaction) => {
        const user = await selectUser(transaction, { email: data.email });

        if (user === null) {
          return response.status(200).send({});
        }

        await createEmail(transaction, {
          ident: EmailIdent.FORGOTTEN_PASSWORD,
          recipientId: user.id,
          sentAt: null,
          context: {
            username: user.displayName ?? user.username,
          },
        });
      });

      response.status(200).send({});
    }),
  );
}

export default putAuthForgottenPassword;
