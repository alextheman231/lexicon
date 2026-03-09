import type { Router } from "express";

import handleMiddleware from "src/utility/handleMiddleware";

function getUsers(router: Router): void {
  router.route("/:userId").get(
    handleMiddleware<{ userId: string }>(async (_request, _response, _next) => {
      // Logic here
    }),
  );
}

export default getUsers;
