import type { Express } from "express";

import { CodeError } from "@alextheman/utility/v6";

import initialiseAuthRouter from "src/server/routes/auth";
import initialiseBlogsRouter from "src/server/routes/blogs";
import initialiseCurrentUserRouter from "src/server/routes/currentUser";
import initialiseUsersRouter from "src/server/routes/users";
import defineEndpoint from "src/utility/defineEndpoint";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";
import initialiseRouter from "src/utility/initialiseRouter";
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

  initialiseRouter(app, "auth", initialiseAuthRouter);
  initialiseRouter(app, "blogs", initialiseBlogsRouter);
  initialiseRouter(app, "current-user", initialiseCurrentUserRouter);
  initialiseRouter(app, "users", initialiseUsersRouter);

  app.get(defineEndpoint("control/be-error"), () => {
    throw new CodeError(
      "TEST_ERROR",
      "This is an error that should crash the page and report to Sentry.",
    );
  });
}

export default createEndpoints;
