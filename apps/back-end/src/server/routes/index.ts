import type { Express } from "express";

import authRouter from "src/server/routes/auth";
import usersRouter from "src/server/routes/users";
import defineEndpoint from "src/utility/defineEndpoint";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";

function createEndpoints(app: Express) {
  app.get(
    defineEndpoint(),
    handleEndpointMiddleware((_request, response) => {
      response.status(200).send({ hello: "world" });
    }),
  );
  app.use(defineEndpoint("users"), usersRouter);
  app.use(defineEndpoint("auth"), authRouter);
}

export default createEndpoints;
