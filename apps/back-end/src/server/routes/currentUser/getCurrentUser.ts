import type { Router } from "express";

import { secondsToMs } from "@alextheman/utility";

import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

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
