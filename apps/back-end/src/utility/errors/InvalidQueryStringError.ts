import type { ZodError } from "zod";

import type { LexiconErrorCode } from "src/utility/errors/LexiconErrorCode";

import z from "zod";

import APIError from "src/utility/errors/APIError";
import DataError from "src/utility/errors/DataError";

interface InvalidQueryStringErrorPayload {
  query: unknown;
}

class InvalidQueryStringError extends DataError<InvalidQueryStringErrorPayload, LexiconErrorCode> {
  public constructor(data: InvalidQueryStringErrorPayload, parsingError: ZodError) {
    super(
      data,
      "INVALID_QUERY_STRING",
      `The provided query string is invalid:\n\n${z.prettifyError(parsingError)}`,
    );
  }

  public override toAPIError(): APIError<object, LexiconErrorCode> {
    return new APIError(400, this.code, this.message, this.data);
  }
}

export default InvalidQueryStringError;
