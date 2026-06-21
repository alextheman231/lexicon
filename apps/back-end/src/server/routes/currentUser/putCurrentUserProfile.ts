import type { Router } from "express";

import { parseUser, parseUserProfileUpdateData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import editUserProfile from "src/services/users/mutations/transaction/editUserProfile";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";

function putCurrentUserProfile(currentUser: Router) {
  currentUser.put(
    "/profile",
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
