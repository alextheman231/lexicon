import type { Env } from "@alextheman/utility";

import ENV from "src/utility/constants/ENV";
import endpointNotFoundError from "src/utility/endpointNotFoundError";
import handleFallthroughMiddleware from "src/utility/handleFallthroughMiddleware";

function allowEnvironments(environments: Array<Env>) {
  return handleFallthroughMiddleware((request) => {
    if (!environments.includes(ENV)) {
      throw endpointNotFoundError({ endpoint: request.path });
    }
  });
}

export default allowEnvironments;
