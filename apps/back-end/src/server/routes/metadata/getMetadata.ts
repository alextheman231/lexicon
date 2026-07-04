import type { Router } from "express";

import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

function getMetadata(metadata: Router) {
  metadata.get(
    "/",
    handleEndpointMiddleware((_request, response) => {
      response.status(200).send({
        commitHash: process.env.GITHUB_SHA ?? null,
      });
    }),
  );
}

export default getMetadata;
