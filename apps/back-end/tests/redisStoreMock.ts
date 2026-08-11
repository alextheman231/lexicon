import { vi } from "vitest";

import handleFallthroughMiddleware from "src/utility/handlers/handleFallthroughMiddleware";

vi.mock("src/server/rateLimit/store", () => {
  return {
    default: undefined,
  };
});

// TODO: Get rate-limiting in tests to actually work.
vi.mock("src/utility/handlers/handleRateLimit", () => {
  return {
    default: () => {
      return handleFallthroughMiddleware(() => {});
    },
  };
});
