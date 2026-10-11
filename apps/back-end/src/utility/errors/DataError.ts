import type { APIError } from "@alextheman/utility/v6";

// eslint-disable-next-line no-restricted-imports -- We need to use the original DataError to redefine the Lexicon-specific one.
import { DataError as AlexDataError } from "@alextheman/utility/v6";

import InternalServerError from "src/utility/errors/InternalServerError";

class DataError<
  DataType extends object = Record<PropertyKey, unknown>,
  ErrorCode extends string = string,
> extends AlexDataError<DataType, ErrorCode> {
  public toAPIError(): APIError<object, string> {
    return new InternalServerError();
  }
}

export default DataError;
