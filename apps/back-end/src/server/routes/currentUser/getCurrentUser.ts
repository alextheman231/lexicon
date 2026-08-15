import type { Router } from "express";

import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";
import msToSeconds from "src/utility/timeConverters/msToSeconds";

function getCurrentUser(currentUser: Router) {
  currentUser.get(
    "/",
    handleRateLimit({
      limit: 30,
      windowMs: msToSeconds(10),
    }),
    handleEndpointMiddleware(async (request, response) => {
      response.status(200).send({ user: request.user });
    }),
  );
}

export default getCurrentUser;
