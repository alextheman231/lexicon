import type { Router } from "express";

import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";

function getProtected(root: Router) {
  root.get(
    "/protected",
    handleAuthenticatedEndpointMiddleware((request, response) => {
      response.status(200).send({ user: request.user });
    }),
  );
}

export default getProtected;
