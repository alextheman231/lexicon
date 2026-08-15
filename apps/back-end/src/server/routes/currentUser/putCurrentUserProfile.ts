import type { Router } from "express";

import { secondsToMs } from "@alextheman/utility";
import { parseUser, parseUserProfileUpdateData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import editUserProfile from "src/services/users/mutations/transaction/editUserProfile";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function putCurrentUserProfile(currentUser: Router) {
  currentUser.put(
    "/profile",
    handleRateLimit({
      limit: 5,
      windowMs: secondsToMs(10),
    }),
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const user = parseUser(request.user);

      const data = parseUserProfileUpdateData(request.body);

      await connection.transaction(async (transaction) => {
        await editUserProfile(transaction, user.id, data);
      });
      response.status(200).send({});
    }),
  );
}

export default putCurrentUserProfile;
