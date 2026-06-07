import type { Express } from "express";

import { setupExpressErrorHandler } from "@sentry/node";

import handleAPIErrors from "src/server/errors/handleAPIErrors";
import handleClearCookies from "src/server/errors/handleClearCookies";
import handleDebugLogging from "src/server/errors/handleDebugLogging";
import handleInternalServerErrors from "src/server/errors/handleInternalServerErrors";
import handleUnfoundEndpoint from "src/server/errors/handleUnfoundEndpoint";
import parseEnv from "src/utility/miscellaneous/parseEnv";

const ENV = parseEnv(process.env.NODE_ENV ?? "development");

export function resolveErrors(app: Express) {
  if (ENV === "production") {
    setupExpressErrorHandler(app);
  }

  app.use(handleUnfoundEndpoint);
  app.use(handleClearCookies);
  app.use(handleDebugLogging);
  app.use(handleAPIErrors);
  app.use(handleInternalServerErrors);
}
