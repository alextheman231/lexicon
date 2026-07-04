import type { Express } from "express";

import { CodeError } from "@alextheman/utility/v6";

import initialiseAuthRouter from "src/server/routes/auth";
import initialiseBlogCollectionsRouter from "src/server/routes/blogCollections";
import initialiseBlogsRouter from "src/server/routes/blogs";
import initialiseCurrentUserRouter from "src/server/routes/currentUser";
import initialiseMetadataRouter from "src/server/routes/metadata";
import initialiseUsersRouter from "src/server/routes/users";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import defineEndpoint from "src/utility/initialisers/defineEndpoint";
import initialiseRouter from "src/utility/initialisers/initialiseRouter";

function createEndpoints(app: Express) {
  app.get(
    defineEndpoint(),
    handleEndpointMiddleware((_request, response) => {
      response.status(200).send({ hello: "world" });
    }),
  );

  app.get(
    defineEndpoint("protected"),
    handleAuthenticatedEndpointMiddleware((request, response) => {
      const { user } = request;
      response.status(200).send({ user });
    }),
  );

  initialiseRouter(app, "metadata", initialiseMetadataRouter);
  initialiseRouter(app, "auth", initialiseAuthRouter);
  initialiseRouter(app, "blogs", initialiseBlogsRouter);
  initialiseRouter(app, "blog-collections", initialiseBlogCollectionsRouter);
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
