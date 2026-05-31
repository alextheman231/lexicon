import { init } from "@sentry/node";

import ENV from "src/utility/constants/ENV";

if (ENV === "production" && process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.SENTRY_RELEASE,
  });
}
