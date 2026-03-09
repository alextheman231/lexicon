import type { Router } from "express";

import useMiddleware from "src/utility/useMiddleware";

function getUsers(router: Router): void {
  router.route("/:userId").get(
    useMiddleware<{ userId: string }>(async (_request, _response, _next) => {
      // Logic here
    }),
  );
}

export default getUsers;
