import { CodeError } from "@alextheman/utility/v6";

import ENV from "src/utility/constants/ENV";
import internalServerError from "src/utility/errors/internalServerError";
import handleErrorMiddleware from "src/utility/handlers/handleErrorMiddleware";

const handleInternalServerErrors = handleErrorMiddleware((error, _request, response) => {
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
});

export default handleInternalServerErrors;
