import type { Express } from "express";

import { DataError, parseBoolean, parseEnv, parseIntStrict } from "@alextheman/utility";

import handleErrorMiddleware from "src/utility/handleErrorMiddleware";

const ENV = parseEnv(process.env.NODE_ENV ?? "development");
const DEBUG = parseBoolean(process.env.DEBUG ?? "false");

export function handleErrors(app: Express) {
  app.use(
    handleErrorMiddleware((error, _request, _response) => {
      if (ENV !== "test" || (ENV === "test" && DEBUG)) {
        console.error(error);
      }
    }),
  );

  app.use(
    handleErrorMiddleware((error, _request, response) => {
      if (DataError.check(error) && error.code === "INVALID_UUID") {
        response.status(400).send({ error: { id: error.data.input } });
      }
    }),
  );

  app.use(
    handleErrorMiddleware((error, _request, response) => {
      if (DataError.check(error) && error.code === "RESOURCE_NOT_FOUND") {
        response.status(parseIntStrict(`${error.data.statusCode}`)).send({ error });
      }
    }),
  );

  app.use(
    handleErrorMiddleware((error, _request, response) => {
      response.status(500).send({ error });
    }),
  );
}
