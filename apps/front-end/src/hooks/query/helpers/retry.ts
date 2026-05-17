import { captureMessage } from "@sentry/react";

import serverResponded from "src/utility/query/serverResponded";

const MAX_FAILURES = 2;

function retry(queryKey?: ReadonlyArray<unknown>) {
  return (failureCount: number, error: unknown) => {
    if (failureCount < MAX_FAILURES && !serverResponded(error)) {
      return true;
    }
    if (
      import.meta.env.PROD &&
      queryKey &&
      failureCount >= MAX_FAILURES &&
      !serverResponded(error)
    ) {
      captureMessage(`Query ${queryKey.join(",")} final retry failed.`);
    }
    return false;
  };
}

export default retry;
