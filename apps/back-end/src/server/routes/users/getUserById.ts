import type { Router } from "express";

import { getConnection } from "src/database/connection";
import selectUser from "src/models/users/selectUser";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import validateUUID from "src/utility/handlers/validateUUID";

function getUserById(users: Router) {
  users.param("userId", validateUUID).get(
    "/:userId",
    handleEndpointMiddleware<{ userId: string }>(async (request, response) => {
      const connection = getConnection();

      const user = await selectUser(connection, request.params);

      if (user === null) {
        throw resourceNotFoundError("user", request.params.userId);
      }

      response.status(200).send({ user });
    }),
  );
}

export default getUserById;
