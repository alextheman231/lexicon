import APIError from "src/utility/errors/APIError";
import CodeError from "src/utility/errors/CodeError";
import DataError from "src/utility/errors/DataError";
import handleErrorMiddleware from "src/utility/handlers/handleErrorMiddleware";

const handleAPIErrors = handleErrorMiddleware((error, _request, response, next) => {
  if (APIError.check(error)) {
    if (error.data !== undefined && error.data !== null) {
      const serialisedError = new DataError(error.data, error.code, error.message).toJSON();
      response.status(error.status).send({ error: serialisedError });
    } else {
      const serialisedError = new CodeError(error.code, error.message).toJSON();
      response.status(error.status).send({ error: serialisedError });
    }
    return;
  }
  next(error);
});

export default handleAPIErrors;
