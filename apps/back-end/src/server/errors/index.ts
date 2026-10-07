import type { Express } from "express";

import { parseIntStrict } from "@alextheman/utility";
import { expressIntegration } from "@sentry/node";

import handleAPIErrors from "src/server/errors/handleAPIErrors";
import handleClearCookies from "src/server/errors/handleClearCookies";
import handleDebugLogging from "src/server/errors/handleDebugLogging";
import handleInternalServerErrors from "src/server/errors/handleInternalServerErrors";
import handleUnfoundEndpoint from "src/server/errors/handleUnfoundEndpoint";
import loadEnvironment from "src/utility/env/loadEnvironment";

const ENV = loadEnvironment();

function resolveErrors(app: Express) {
  if (ENV === "production") {
    expressIntegration({
      shouldHandleError: (error) => {
        const statusCode =
          typeof error.statusCode === "string"
            ? parseIntStrict(error.statusCode)
            : error.statusCode;
        return (statusCode ?? 500) >= 500;
      },
    });
  }

  app.use(handleUnfoundEndpoint);
  app.use(handleClearCookies);
  app.use(handleDebugLogging);
  app.use(handleAPIErrors);
  app.use(handleInternalServerErrors);
}

export default resolveErrors;
