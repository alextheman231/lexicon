import { parseBoolean } from "@alextheman/utility";

import ENV from "src/utility/constants/ENV";
import handleErrorMiddleware from "src/utility/handleErrorMiddleware";

const DEBUG = parseBoolean(process.env.DEBUG ?? "false");

const handleDebugLogging = handleErrorMiddleware((error, _request, _response, next) => {
  if (ENV !== "test" || (ENV === "test" && DEBUG)) {
    console.error(error);
  }
  next(error);
});

export default handleDebugLogging;
