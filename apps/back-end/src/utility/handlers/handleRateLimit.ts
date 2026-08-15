import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

import redisClient from "src/server/rateLimit/redis";
import loadEnvironment from "src/utility/env/loadEnvironment";

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

function handleRateLimit({ limit, windowMs }: RateLimitOptions) {
  const ENV = loadEnvironment();

  const store =
    ENV === "production"
      ? new RedisStore({
          sendCommand: (...args) => {
            return redisClient.sendCommand(args);
          },
        })
      : undefined;

  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ...(store === undefined ? {} : { store }),
  });
}

export default handleRateLimit;
