import { parseBoolean } from "@alextheman/utility";

import handleErrorMiddleware from "src/utility/handlers/handleErrorMiddleware";
import parseEnv from "src/utility/miscellaneous/parseEnv";

const ENV = parseEnv(process.env.NODE_ENV ?? "development");
const DEBUG = parseBoolean(process.env.DEBUG ?? "false");

const handleDebugLogging = handleErrorMiddleware((error, _request, _response, next) => {
  if (ENV !== "test" || (ENV === "test" && DEBUG)) {
    console.error(error);
  }
  next(error);
});

export default handleDebugLogging;
