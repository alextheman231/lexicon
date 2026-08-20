import type { Router } from "express";

import getCurrentUser from "src/server/routes/currentUser/getCurrentUser";
import putCurrentUserProfile from "src/server/routes/currentUser/putCurrentUserProfile";
import putCurrentUserProfilePicture from "src/server/routes/currentUser/putCurrentUserProfilePicture";
import registerEndpoints from "src/utility/initialisers/registerEndpoints";

function initialiseCurrentUserRouter(router: Router) {
  registerEndpoints(router, {
    getCurrentUser,
    putCurrentUserProfile,
    putCurrentUserProfilePicture,
  });
}

export default initialiseCurrentUserRouter;
