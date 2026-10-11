import loadEnvironment from "src/utility/env/loadEnvironment";
import CodeError from "src/utility/errors/CodeError";
import InternalServerError from "src/utility/errors/InternalServerError";
import handleErrorMiddleware from "src/utility/handlers/handleErrorMiddleware";

const ENV = loadEnvironment();

const handleInternalServerErrors = handleErrorMiddleware((error, _request, response) => {
  if (
    ENV !== "test" ||
    (ENV === "test" &&
      (!CodeError.check(error) || (CodeError.check(error) && error.code !== "TEST_ERROR")))
  ) {
    console.error(error);
  }
  const serverError = new InternalServerError();
  response.status(serverError.status).send({
    error: new CodeError(serverError.code, serverError.message).toJSON(),
  });
});

export default handleInternalServerErrors;
