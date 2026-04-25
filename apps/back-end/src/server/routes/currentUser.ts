import type { UserProfileData } from "@lexicon/models";
import type { ParamsDictionary } from "express-serve-static-core";

import { parseUser } from "@lexicon/models";
import { Router } from "express";

import { getConnection } from "src/database/connection";
import { updateUserProfile } from "src/services/users";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";
import requireAuth from "src/utility/validators/requireAuth";

const currentUserRouter = Router();

currentUserRouter.put(
  "/profile",
  requireAuth,
  handleEndpointMiddleware<ParamsDictionary, unknown, UserProfileData>(
    async (request, response) => {
      const connection = getConnection();
      const user = parseUser(request.user);
      await updateUserProfile(connection, user.id, request.body);
      response.status(200).send({});
    },
  ),
);

export default currentUserRouter;
