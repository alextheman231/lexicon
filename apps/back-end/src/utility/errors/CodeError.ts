import type APIError from "src/utility/errors/APIError";
import type { LexiconErrorCode } from "src/utility/errors/LexiconErrorCode";

import { CodeError as AlexCodeError } from "@alextheman/utility/v6";

import InternalServerError from "src/utility/errors/InternalServerError";

class CodeError<
  ErrorCode extends LexiconErrorCode = LexiconErrorCode,
> extends AlexCodeError<ErrorCode> {
  public toAPIError(): APIError {
    return new InternalServerError();
  }
}

export default CodeError;
