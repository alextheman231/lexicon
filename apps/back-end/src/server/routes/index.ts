import type { Express } from "express";

import users from "src/server/routes/users";
import defineEndpoint from "src/utility/defineEndpoint";

function createEndpoints(app: Express) {
  app.use(defineEndpoint("users"), users());
}

export default createEndpoints;
