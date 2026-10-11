import type { Env } from "src/utility/miscellaneous/parseEnv";

import loadEnvironment from "src/utility/env/loadEnvironment";
import EndpointNotFoundError from "src/utility/errors/EndpointNotFoundError";
import handleFallthroughMiddleware from "src/utility/handlers/handleFallthroughMiddleware";

const ENV = loadEnvironment();

function allowEnvironments(environments: Array<Env>) {
  return handleFallthroughMiddleware((request) => {
    if (!environments.includes(ENV)) {
      throw new EndpointNotFoundError({ endpoint: request.path });
    }
  });
}

export default allowEnvironments;
