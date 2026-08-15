import type { Router } from "express";

import { secondsToMs } from "@alextheman/utility";

import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

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
