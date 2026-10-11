import type { Router } from "express";

import CodeError from "src/utility/errors/CodeError";

function getBackendError(root: Router) {
  root.get("/control/be-error", () => {
    throw new CodeError(
      "TEST_ERROR",
      "This is an error that should crash the page and report to Sentry.",
    );
  });
}

export default getBackendError;
