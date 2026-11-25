import type { Router } from "express";

import { minutesToMs } from "@alextheman/utility";
import { parseResetPasswordData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import resetPassword from "src/services/auth/resetPassword";
import verifyToken from "src/services/auth/verifyToken";
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
      const userId = await verifyToken(data.token, "forgotten-password");

      await connection.transaction(async (transaction) => {
        await resetPassword(transaction, userId, data.password);
      });

      response.status(200).send({});
    }),
  );
}

export default putAuthResetPassword;
