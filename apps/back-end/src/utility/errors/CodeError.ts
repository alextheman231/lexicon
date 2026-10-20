import type APIError from "src/utility/errors/APIError";
import type { LexiconErrorCode } from "src/utility/errors/LexiconErrorCode";

// eslint-disable-next-line no-restricted-imports -- We need to use the original CodeError to redefine the Lexicon-specific one.
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
