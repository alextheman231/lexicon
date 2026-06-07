import { Router } from "express";

import { getConnection } from "src/database/connection";
import selectUser from "src/models/users/selectUser";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";
import resourceNotFoundError from "src/utility/resourceNotFoundError";
import validateUUID from "src/utility/validators/validateUUID";

const usersRouter = Router();

usersRouter
  .param("userId", validateUUID)
  .route("/:userId")
  .get(
    handleEndpointMiddleware<{ userId: string }>(async (request, response) => {
      const connection = getConnection();

      const user = await selectUser(connection, request.params);

      if (user === null) {
        throw resourceNotFoundError("user", request.params.userId);
      }

      response.status(200).send({ user });
    }),
  );

export default usersRouter;
