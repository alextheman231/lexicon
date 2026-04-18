import type { Express } from "express";

import authRouter from "src/server/routes/auth";
import usersRouter from "src/server/routes/users";
import defineEndpoint from "src/utility/defineEndpoint";
import handleMiddleware from "src/utility/handleMiddleware";

function createEndpoints(app: Express) {
  app.get(
    defineEndpoint(),
    handleMiddleware((_request, response) => {
      response.status(200).send({ hello: "world" });
    }),
  );
  app.use(defineEndpoint("users"), usersRouter);
  app.use(defineEndpoint("auth"), authRouter);
}

export default createEndpoints;
