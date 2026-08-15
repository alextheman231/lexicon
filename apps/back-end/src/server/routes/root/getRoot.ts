import type { Router } from "express";

import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

function getRoot(root: Router) {
  root.get(
    "/",
    handleEndpointMiddleware((_request, response) => {
      response.status(200).send({ hello: "world" });
    }),
  );
}

export default getRoot;
