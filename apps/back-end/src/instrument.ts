import { init } from "@sentry/node";

import loadEnvironment from "src/utility/env/loadEnvironment";

const ENV = loadEnvironment();

if (ENV === "production" && process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.SENTRY_RELEASE,
  });
}
