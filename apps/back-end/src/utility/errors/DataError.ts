import type APIError from "src/utility/errors/APIError";
import type { LexiconErrorCode } from "src/utility/errors/LexiconErrorCode";

import { DataError as AlexDataError } from "@alextheman/utility/v6";

import InternalServerError from "src/utility/errors/InternalServerError";

class DataError<
  DataType extends object = Record<PropertyKey, unknown>,
  ErrorCode extends LexiconErrorCode = LexiconErrorCode,
> extends AlexDataError<DataType, ErrorCode> {
  public toAPIError(): APIError<object> {
    return new InternalServerError();
  }
}

export default DataError;
