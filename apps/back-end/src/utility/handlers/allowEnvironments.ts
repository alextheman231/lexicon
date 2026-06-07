import type { Env } from "src/utility/miscellaneous/parseEnv";

import loadEnvironment from "src/utility/env/loadEnvironment";
import endpointNotFoundError from "src/utility/errors/endpointNotFoundError";
import handleFallthroughMiddleware from "src/utility/handlers/handleFallthroughMiddleware";

const ENV = loadEnvironment();

function allowEnvironments(environments: Array<Env>) {
  return handleFallthroughMiddleware((request) => {
    if (!environments.includes(ENV)) {
      throw endpointNotFoundError({ endpoint: request.path });
    }
  });
}

export default allowEnvironments;
