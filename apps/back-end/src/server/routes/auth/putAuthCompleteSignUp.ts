import type { Router } from "express";

import { minutesToMs } from "@alextheman/utility";
import { parseCompleteSignUpData, UserState } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import resetPassword from "src/services/auth/resetPassword";
import verifyToken from "src/services/auth/verifyToken";
import changeUserState from "src/services/users/changeUserState";
import APIError from "src/utility/errors/APIError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function putAuthCompleteSignUp(auth: Router) {
  auth.put(
    "/complete-sign-up",
    handleRateLimit({
      limit: 10,
      windowMs: minutesToMs(15),
    }),
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      const data = parseCompleteSignUpData(request.body, () => {
        return new APIError(400, "INVALID_SIGN_UP_DATA", "The reset password data is invalid.");
      });
      const userId = await verifyToken(data.token, "complete-sign-up");

      if (data.password !== data.passwordAgain) {
        throw new APIError(
          400,
          "PASSWORDS_DO_NOT_MATCH",
          "The passwords do not match. Please try again.",
        );
      }

      await connection.transaction(async (transaction) => {
        await resetPassword(transaction, userId, data.password);
        await changeUserState(transaction, userId, {
          newState: UserState.VERIFIED,
          updatedById: null,
        });
      });

      response.status(200).send({});
    }),
  );
}

export default putAuthCompleteSignUp;
