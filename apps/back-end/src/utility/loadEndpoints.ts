import type { Router } from "express";

function loadEndpoints(
  router: Router,
  endpointsMap: Record<PropertyKey, (router: Router) => void | Promise<void>>,
): void {
  for (const endpoint of Object.values(endpointsMap)) {
    endpoint(router);
  }
}

export default loadEndpoints;
