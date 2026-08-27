import type { Router } from "express";

import { secondsToMs, UUID_REGEX_PATTERN } from "@alextheman/utility";

import { getConnection } from "src/database/connection";
import loadUserProfile from "src/services/users/views/loadUserProfile";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function getUserById(users: Router) {
  users.get(
    RegExp(`^/(?<userId>${UUID_REGEX_PATTERN})$`),
    handleRateLimit({
      limit: 30,
      windowMs: secondsToMs(10),
    }),
    handleEndpointMiddleware<{ userId: string }>(async (request, response) => {
      const connection = getConnection();

      const user = await loadUserProfile(connection, request.params);

      if (user === null) {
        throw resourceNotFoundError("user", request.params.userId);
      }

      response.status(200).send({ user });
    }),
  );
}

export default getUserById;
