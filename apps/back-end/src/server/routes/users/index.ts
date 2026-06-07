import type { Router } from "express";

import getUserById from "src/server/routes/users/getUserById";
import registerEndpoints from "src/utility/initialisers/registerEndpoints";

function initialiseUsersRouter(router: Router) {
  registerEndpoints(router, {
    getUserById,
  });
}

export default initialiseUsersRouter;
