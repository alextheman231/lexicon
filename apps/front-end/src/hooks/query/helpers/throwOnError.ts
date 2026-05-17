import isServerError from "src/utility/query/isServerError";
import isZodError from "src/utility/query/isZodError";

function throwOnError(error: unknown) {
  return isServerError(error) || isZodError(error);
}

export default throwOnError;
