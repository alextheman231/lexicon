import { parseBoolean } from "@alextheman/utility";

import loadEnvironment from "src/utility/env/loadEnvironment";
import handleErrorMiddleware from "src/utility/handlers/handleErrorMiddleware";

const ENV = loadEnvironment();
const DEBUG = parseBoolean(process.env.DEBUG ?? "false");

const handleDebugLogging = handleErrorMiddleware((error, _request, _response, next) => {
  if (ENV !== "test" || (ENV === "test" && DEBUG)) {
    console.error(error);
  }
  next(error);
});

export default handleDebugLogging;
