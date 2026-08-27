import type { Router } from "express";

import getUserById from "src/server/routes/users/getUserById";
import getUserProfilePictureByUserId from "src/server/routes/users/getUserProfilePictureByUserId";
import registerEndpoints from "src/utility/initialisers/registerEndpoints";

function initialiseUsersRouter(router: Router) {
  registerEndpoints(router, {
    getUserById,
    getUserProfilePictureByUserId,
  });
}

export default initialiseUsersRouter;
