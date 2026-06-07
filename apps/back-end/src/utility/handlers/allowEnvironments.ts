import type { Env } from "src/utility/miscellaneous/parseEnv";

import endpointNotFoundError from "src/utility/errors/endpointNotFoundError";
import handleFallthroughMiddleware from "src/utility/handlers/handleFallthroughMiddleware";
import parseEnv from "src/utility/miscellaneous/parseEnv";

const ENV = parseEnv(process.env.NODE_ENV ?? "development");

function allowEnvironments(environments: Array<Env>) {
  return handleFallthroughMiddleware((request) => {
    if (!environments.includes(ENV)) {
      throw endpointNotFoundError({ endpoint: request.path });
    }
  });
}

export default allowEnvironments;
