import CodeError from "src/utility/errors/CodeError";
import DataError from "src/utility/errors/DataError";
import handleErrorMiddleware from "src/utility/handlers/handleErrorMiddleware";

const handleLexiconBackEndErrors = handleErrorMiddleware((error, _request, _response, next) => {
  if (error instanceof CodeError || error instanceof DataError) {
    next(error.toAPIError());
  } else {
    next(error);
  }
});

export default handleLexiconBackEndErrors;
