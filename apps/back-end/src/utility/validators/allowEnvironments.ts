import type { Env } from "@alextheman/utility";

import { parseEnv } from "@alextheman/utility";

import endpointNotFoundError from "src/utility/endpointNotFoundError";
import handleFallthroughMiddleware from "src/utility/handleFallthroughMiddleware";

const ENV = parseEnv(process.env.NODE_ENV ?? "development");

function allowEnvironments(environments: Array<Env>) {
  return handleFallthroughMiddleware((request) => {
    if (!environments.includes(ENV)) {
      throw endpointNotFoundError({ endpoint: request.path });
    }
  });
}

export default allowEnvironments;
