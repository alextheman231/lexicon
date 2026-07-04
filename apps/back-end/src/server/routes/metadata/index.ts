import type { Router } from "express";

import getMetadata from "src/server/routes/metadata/getMetadata";
import registerEndpoints from "src/utility/initialisers/registerEndpoints";

function initialiseMetadataRouter(router: Router) {
  registerEndpoints(router, {
    getMetadata,
  });
}

export default initialiseMetadataRouter;
