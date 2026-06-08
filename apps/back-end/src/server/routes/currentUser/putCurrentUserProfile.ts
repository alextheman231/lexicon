import type { Router } from "express";

import { parseUser, parseUserProfileUpdateData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import editUserProfile from "src/services/users/editUserProfile";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";

function putCurrentUserProfile(currentUser: Router) {
  currentUser.put(
    "/profile",
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const user = parseUser(request.user);

      const data = parseUserProfileUpdateData(request.body);

      await editUserProfile(connection, user.id, data);
      response.status(200).send({});
    }),
  );
}

export default putCurrentUserProfile;
