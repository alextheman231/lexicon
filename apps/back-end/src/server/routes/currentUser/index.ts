import type { Router } from "express";

import getCurrentUser from "src/server/routes/currentUser/getCurrentUser";
import putCurrentUserProfile from "src/server/routes/currentUser/putCurrentUserProfile";
import registerEndpoints from "src/utility/registerEndpoints";

function initialiseCurrentUserRouter(router: Router) {
  registerEndpoints(router, {
    getCurrentUser,
    putCurrentUserProfile,
  });
}

export default initialiseCurrentUserRouter;
