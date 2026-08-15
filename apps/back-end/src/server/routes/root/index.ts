import type { Router } from "express";

import getBackendError from "src/server/routes/root/getBackendError";
import getProtected from "src/server/routes/root/getProtected";
import getRoot from "src/server/routes/root/getRoot";
import registerEndpoints from "src/utility/initialisers/registerEndpoints";

function initialiseRootRouter(router: Router) {
  registerEndpoints(router, {
    getBackendError,
    getProtected,
    getRoot,
  });
}

export default initialiseRootRouter;
