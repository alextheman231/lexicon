import type { Router } from "express";

import { parseCreateUserData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import createUser from "src/services/users/mutations/transaction/createUser";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

function postUser(users: Router) {
  users.post(
    "/users",
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      const data = parseCreateUserData(request.body);

      await connection.transaction(async (transaction) => {
        const user = await createUser(transaction, data);
        response.status(201).send({ id: user.id });
      });
    }),
  );
}

export default postUser;
