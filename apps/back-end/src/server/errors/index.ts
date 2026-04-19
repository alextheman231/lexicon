import type { Express } from "express";

import { DataError, parseBoolean, parseEnv, parseIntStrict } from "@alextheman/utility";

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
      if (DataError.check(error) && error.code === "INVALID_UUID") {
        response.status(400).send({ error: { id: error.data.input } });
        return;
      }
      next(error);
    }),
  );

  app.use(
    handleErrorMiddleware((error, _request, response, next) => {
      if (DataError.check(error) && error.code === "RESOURCE_NOT_FOUND") {
        response.status(parseIntStrict(`${error.data.statusCode}`)).send({ error });
        return;
      }
      next(error);
    }),
  );

  app.use(
    handleErrorMiddleware((error, _request, response) => {
      console.error(error);
      response.status(500).send({ error });
    }),
  );
}
