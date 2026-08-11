import RedisStore from "rate-limit-redis";

import redisClient from "src/server/rateLimit/redis";
import loadEnvironment from "src/utility/env/loadEnvironment";

const ENV = loadEnvironment();

const store =
  ENV === "production"
    ? new RedisStore({
        sendCommand: (...args) => {
          return redisClient.sendCommand(args);
        },
      })
    : undefined;

export default store;
