import type { Router } from "express";

import { getConnection } from "src/database/connection";
import selectUser from "src/models/users/selectUser";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";
import resourceNotFoundError from "src/utility/resourceNotFoundError";
import validateUUID from "src/utility/validators/validateUUID";

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
