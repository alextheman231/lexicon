import type { Router } from "express";

import getAuthGoogle from "src/server/routes/auth/getAuthGoogle";
import getAuthGoogleCallback from "src/server/routes/auth/getAuthGoogleCallback";
import postAuthEndToEnd from "src/server/routes/auth/postAuthEndToEnd";
import postAuthLogout from "src/server/routes/auth/postAuthLogout";
import registerEndpoints from "src/utility/registerEndpoints";

function initialiseAuthRouter(router: Router) {
  registerEndpoints(router, {
    getAuthGoogle,
    getAuthGoogleCallback,
    postAuthEndToEnd,
    postAuthLogout,
  });
}

export default initialiseAuthRouter;
