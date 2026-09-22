import type { Router } from "express";

import getUserInfoById from "src/server/routes/users/getUserInfoById";
import getUserProfileById from "src/server/routes/users/getUserProfileById";
import getUserProfilePictureByUserId from "src/server/routes/users/getUserProfilePictureByUserId";
import postUser from "src/server/routes/users/postUser";
import registerEndpoints from "src/utility/initialisers/registerEndpoints";

function initialiseUsersRouter(router: Router) {
  registerEndpoints(router, {
    getUserInfoById,
    getUserProfileById,
    getUserProfilePictureByUserId,
    postUser,
  });
}

export default initialiseUsersRouter;
