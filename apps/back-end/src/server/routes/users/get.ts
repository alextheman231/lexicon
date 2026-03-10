import type { Router } from "express";

import { getConnection } from "src/database/connection";
import { selectUser } from "src/services/users";
import handleMiddleware from "src/utility/handleMiddleware";
import resourceNotFoundError from "src/utility/resourceNotFoundError";
import validateUUID from "src/utility/validateUUID";

function getUsers(router: Router): void {
  router
    .param("userId", validateUUID)
    .route("/:userId")
    .get(
      handleMiddleware<{ userId: string }>(async (request, response) => {
        const user = await selectUser(getConnection(), request.params.userId);

        if (user === null) {
          throw resourceNotFoundError("user", request.params.userId);
        }

        response.status(200).send({ user });
      }),
    );
}

export default getUsers;
