import type { Router } from "express";

import useMiddleware from "src/utility/useMiddleware";

function getUsers(router: Router): void {
  router.route("/:userId").get(
    useMiddleware<{ userId: string }>(async (request, response, next) => {
      // Logic here
    }),
  );
}

export default getUsers;
