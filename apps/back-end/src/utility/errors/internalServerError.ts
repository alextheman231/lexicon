import { APIError } from "@alextheman/utility/v6";

function internalServerError(): APIError<never, "INTERNAL_SERVER_ERROR"> {
  return new APIError(500, "INTERNAL_SERVER_ERROR", "An internal error has occurred.");
}

export default internalServerError;
