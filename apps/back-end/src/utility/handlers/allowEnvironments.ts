import type { Env } from "src/utility/miscellaneous/parseEnv";

import ENV from "src/utility/constants/ENV";
import endpointNotFoundError from "src/utility/errors/endpointNotFoundError";
import handleFallthroughMiddleware from "src/utility/handlers/handleFallthroughMiddleware";

function allowEnvironments(environments: Array<Env>) {
  return handleFallthroughMiddleware((request) => {
    if (!environments.includes(ENV)) {
      throw endpointNotFoundError({ endpoint: request.path });
    }
  });
}

export default allowEnvironments;
