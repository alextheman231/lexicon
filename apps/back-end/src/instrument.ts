import { parseEnv } from "@alextheman/utility";
import { init } from "@sentry/node";

const ENV = parseEnv(process.env.NODE_ENV ?? "development");

if (ENV === "production" && process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.SENTRY_RELEASE,
  });
}
