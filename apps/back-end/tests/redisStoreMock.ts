import { vitest } from "vitest";

import handleFallthroughMiddleware from "src/utility/handlers/handleFallthroughMiddleware";

vitest.mock("src/server/rateLimit/store", () => {
  return {
    default: undefined,
  };
});

// TODO: Get rate-limiting in tests to actually work.
vitest.mock("src/utility/handlers/handleRateLimit", () => {
  return {
    default: () => {
      return handleFallthroughMiddleware(() => {});
    },
  };
});
