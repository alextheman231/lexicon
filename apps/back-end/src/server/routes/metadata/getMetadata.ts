import type { Router } from "express";

import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";
import secondsToMs from "src/utility/timeConverters/secondsToMs";

function getMetadata(metadata: Router) {
  metadata.get(
    "/",
    handleRateLimit({
      limit: 30,
      windowMs: secondsToMs(10),
    }),
    handleEndpointMiddleware((_request, response) => {
      response.status(200).send({
        commitHash: process.env.GITHUB_SHA ?? null,
      });
    }),
  );
}

export default getMetadata;
