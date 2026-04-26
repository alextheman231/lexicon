import type { Express } from "express";

import { parseBoolean, parseEnv } from "@alextheman/utility";
import { APIError, CodeError, DataError } from "@alextheman/utility/v6";

import handleErrorMiddleware from "src/utility/handleErrorMiddleware";

const ENV = parseEnv(process.env.NODE_ENV ?? "development");
const DEBUG = parseBoolean(process.env.DEBUG ?? "false");

export function handleErrors(app: Express) {
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
      console.error(error);
      response.status(500).send({
        error: { code: "INTERNAL_SERVER_ERROR", message: "An internal error has occurred." },
      });
    }),
  );
}
