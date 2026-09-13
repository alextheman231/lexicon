import type { Router } from "express";

import { parseCreateUserData, UserState } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import createUser from "src/services/users/createUser";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

function postUser(users: Router) {
  users.post(
    "/",
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      const data = parseCreateUserData(request.body);

      await connection.transaction(async (transaction) => {
        const user = await createUser(transaction, { ...data, state: UserState.UNVERIFIED });
        response.status(201).send({ id: user.id });
      });
    }),
  );
}

export default postUser;
