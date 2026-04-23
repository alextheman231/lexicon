import type { Express } from "express";

import { parseBoolean, parseEnv, parseIntStrict } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";

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
      if (
        DataError.check<Record<PropertyKey, unknown>, "INVALID_UUID">(error) &&
        error.code === "INVALID_UUID"
      ) {
        response.status(400).send({ error: { id: error.data.input } });
        return;
      }
      next(error);
    }),
  );

  app.use(
    handleErrorMiddleware((error, _request, response, next) => {
      if (
        DataError.check<Record<PropertyKey, unknown>, "RESOURCE_NOT_FOUND">(error) &&
        error.code === "RESOURCE_NOT_FOUND"
      ) {
        response.status(parseIntStrict(`${error.data.statusCode}`)).send({ error });
        return;
      }
      next(error);
    }),
  );

  app.use(
    handleErrorMiddleware((error, _request, response, next) => {
      if (
        DataError.check<Record<PropertyKey, unknown>, "AUTH_REQUIRED">(error) &&
        error.code === "AUTH_REQUIRED"
      ) {
        response.status(401).send({ error });
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
