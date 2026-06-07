import type { Router } from "express";

function registerEndpoints(
  router: Router,
  endpointFunctions: Record<string, (router: Router) => void>,
) {
  for (const endpoint of Object.values(endpointFunctions)) {
    endpoint(router);
  }
}

export default registerEndpoints;
