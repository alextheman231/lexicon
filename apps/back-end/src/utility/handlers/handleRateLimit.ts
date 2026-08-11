import rateLimit from "express-rate-limit";

import store from "src/server/rateLimit/store";

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

function handleRateLimit({ limit, windowMs }: RateLimitOptions) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ...(store === undefined ? {} : { store }),
  });
}

export default handleRateLimit;
