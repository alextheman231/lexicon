import type { Express } from "express";

import authRouter from "src/server/routes/auth";
import usersRouter from "src/server/routes/users";
import defineEndpoint from "src/utility/defineEndpoint";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";
import requireAuth from "src/utility/validators/requireAuth";

function createEndpoints(app: Express) {
  app.get(
    defineEndpoint(),
    handleEndpointMiddleware((_request, response) => {
      response.status(200).send({ hello: "world" });
    }),
  );

  app.get(
    defineEndpoint("protected"),
    requireAuth,
    handleEndpointMiddleware((request, response) => {
      const user = request.user!;
      response.status(200).send({ user });
    }),
  );

  app.use(defineEndpoint("users"), usersRouter);
  app.use(defineEndpoint("auth"), authRouter);
}

export default createEndpoints;
