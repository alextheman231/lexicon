import type { UserProfileData } from "@lexicon/models";
import type { Router } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import { parseUser } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import editUserProfile from "src/services/users/editUserProfile";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import requireAuth from "src/utility/handlers/requireAuth";

function putCurrentUserProfile(currentUser: Router) {
  currentUser.put(
    "/profile",
    requireAuth,
    handleEndpointMiddleware<ParamsDictionary, unknown, UserProfileData>(
      async (request, response) => {
        const connection = getConnection();
        const user = parseUser(request.user);
        await editUserProfile(connection, user.id, request.body);
        response.status(200).send({});
      },
    ),
  );
}

export default putCurrentUserProfile;
