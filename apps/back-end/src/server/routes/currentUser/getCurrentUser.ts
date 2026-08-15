import type { Router } from "express";

import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";
import secondsToMs from "src/utility/timeConverters/secondsToMs";

function getCurrentUser(currentUser: Router) {
  currentUser.get(
    "/",
    handleRateLimit({
      limit: 30,
      windowMs: secondsToMs(10),
    }),
    handleEndpointMiddleware(async (request, response) => {
      response.status(200).send({ user: request.user });
    }),
  );
}

export default getCurrentUser;
