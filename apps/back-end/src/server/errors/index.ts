import type { Express } from "express";

import { parseBoolean } from "@alextheman/utility";
import { APIError, CodeError, DataError } from "@alextheman/utility/v6";
import { setupExpressErrorHandler } from "@sentry/node";

import ENV from "src/utility/constants/ENV";
import endpointNotFoundError from "src/utility/endpointNotFoundError";
import handleErrorMiddleware from "src/utility/handleErrorMiddleware";
import handleFallthroughMiddleware from "src/utility/handleFallthroughMiddleware";
import internalServerError from "src/utility/internalServerError";

const DEBUG = parseBoolean(process.env.DEBUG ?? "false");

export function handleErrors(app: Express) {
  if (ENV === "production") {
    setupExpressErrorHandler(app);
  }

  app.use(
    handleFallthroughMiddleware(async (request) => {
      // If we ever get into this app.use, the endpoint does not exist
      throw endpointNotFoundError({ endpoint: request.path });
    }),
  );

  app.use(
    handleErrorMiddleware((error, _request, response, next) => {
      response.clearCookie("oauth_redirect");
      response.clearCookie("oauth_state");
      response.clearCookie("oauth_pkce_verifier");
      next(error);
    }),
  );

  app.use(
    handleErrorMiddleware((error, _request, _response, next) => {
      if (ENV !== "test" || (ENV === "test" && DEBUG)) {
        console.error(error);
      }
      next(error);
    }),
  );

  app.use(
    handleErrorMiddleware((error, _request, response, next) => {
      if (APIError.check(error)) {
        if (error.data !== undefined && error.data !== null) {
          const serialisedError = new DataError(error.data, error.code, error.message).toJSON();
          response.status(error.status).send({ error: serialisedError });
        } else {
          const serialisedError = new CodeError(error.code, error.message).toJSON();
          response.status(error.status).send({ error: serialisedError });
        }
        return;
      }
      next(error);
    }),
  );

  app.use(
    handleErrorMiddleware((error, _request, response) => {
      if (
        ENV !== "test" ||
        (ENV === "test" &&
          (!CodeError.check(error) || (CodeError.check(error) && error.code !== "TEST_ERROR")))
      ) {
        console.error(error);
      }
      const serverError = internalServerError();
      response.status(serverError.status).send({
        error: new CodeError(serverError.code, serverError.message).toJSON(),
      });
    }),
  );
}
