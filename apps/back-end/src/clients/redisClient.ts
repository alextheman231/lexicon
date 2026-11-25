import { createClient } from "redis";

import loadEnvironment from "src/utility/env/loadEnvironment";

const ENV = loadEnvironment();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

if (ENV === "production") {
  await redisClient.connect();
}

export default redisClient;
