import type { Router } from "express";

import { minutesToMs } from "@alextheman/utility";
import { parseResetPasswordData, UserState } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import selectUser from "src/models/users/selectUser";
import verifyPasswordResetToken from "src/services/auth/verifyPasswordResetToken";
import changeUserPassword from "src/services/users/changeUserPassword";
import changeUserState from "src/services/users/changeUserState";
import expireUserSessions from "src/services/userSessions/expireUserSessions";
import ResourceNotFoundError from "src/utility/errors/ResourceNotFoundError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function putAuthResetPassword(auth: Router) {
  auth.put(
    "/reset-password",
    handleRateLimit({
      limit: 10,
      windowMs: minutesToMs(15),
    }),
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      const data = parseResetPasswordData(request.body);
      const userId = await verifyPasswordResetToken(data.token);

      await connection.transaction(async (transaction) => {
        const user = await selectUser(transaction, { userId });

        if (user === null) {
          throw new ResourceNotFoundError({ resourceType: "user", resourceId: userId });
        }

        await changeUserPassword(transaction, userId, data.password);
        await changeUserState(transaction, userId, {
          newState: UserState.VERIFIED,
          updatedById: null,
        });
        await expireUserSessions(transaction, { userId });
      });

      response.status(200).send({});
    }),
  );
}

export default putAuthResetPassword;
