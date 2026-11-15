import type { Router } from "express";

import getAuthGoogle from "src/server/routes/auth/getAuthGoogle";
import getAuthGoogleCallback from "src/server/routes/auth/getAuthGoogleCallback";
import postAuthEndToEnd from "src/server/routes/auth/postAuthEndToEnd";
import postAuthLogin from "src/server/routes/auth/postAuthLogin";
import postAuthLogout from "src/server/routes/auth/postAuthLogout";
import putAuthResetPassword from "src/server/routes/auth/putAuthResetPassword";
import registerEndpoints from "src/utility/initialisers/registerEndpoints";

function initialiseAuthRouter(router: Router) {
  registerEndpoints(router, {
    getAuthGoogle,
    getAuthGoogleCallback,
    postAuthEndToEnd,
    postAuthLogin,
    postAuthLogout,
    putAuthResetPassword,
  });
}

export default initialiseAuthRouter;
