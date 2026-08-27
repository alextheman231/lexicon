import type { Router } from "express";

import { secondsToMs } from "@alextheman/utility";

import { getConnection } from "src/database/connection";
import loadUserProfile from "src/services/users/views/loadUserProfile";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function getCurrentUser(currentUser: Router) {
  currentUser.get(
    "/",
    handleRateLimit({
      limit: 30,
      windowMs: secondsToMs(10),
    }),
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      if (request.user === null) {
        return response.status(200).send({ user: null });
      }

      const user = await loadUserProfile(connection, { userId: request.user.id });
      response.status(200).send({ user });
    }),
  );
}

export default getCurrentUser;
