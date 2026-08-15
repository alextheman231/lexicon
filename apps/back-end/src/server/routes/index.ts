import type { Express } from "express";

import initialiseAuthRouter from "src/server/routes/auth";
import initialiseBlogCollectionsRouter from "src/server/routes/blogCollections";
import initialiseBlogsRouter from "src/server/routes/blogs";
import initialiseCurrentUserRouter from "src/server/routes/currentUser";
import initialiseMetadataRouter from "src/server/routes/metadata";
import initialiseRootRouter from "src/server/routes/root";
import initialiseUsersRouter from "src/server/routes/users";
import initialiseRouter from "src/utility/initialisers/initialiseRouter";

function createEndpoints(app: Express) {
  initialiseRouter(app, "metadata", initialiseMetadataRouter);
  initialiseRouter(app, "auth", initialiseAuthRouter);
  initialiseRouter(app, "blogs", initialiseBlogsRouter);
  initialiseRouter(app, "blog-collections", initialiseBlogCollectionsRouter);
  initialiseRouter(app, "current-user", initialiseCurrentUserRouter);
  initialiseRouter(app, "users", initialiseUsersRouter);

  initialiseRouter(app, "", initialiseRootRouter);
}

export default createEndpoints;
