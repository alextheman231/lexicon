import type { Express } from "express";

import { Router } from "express";

import defineEndpoint from "src/utility/defineEndpoint";

function initialiseRouter(app: Express, prefix: string, routerFunction: (router: Router) => void) {
  const router = Router();
  routerFunction(router);
  app.use(defineEndpoint(prefix), router);
}

export default initialiseRouter;
