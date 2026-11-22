import type { ZodError } from "zod";

import z from "zod";

import APIError from "src/utility/errors/APIError";
import DataError from "src/utility/errors/DataError";

interface InvalidBlogDataErrorPayload {
  input: unknown;
}

class InvalidBlogDataError extends DataError<InvalidBlogDataErrorPayload> {
  public constructor(data: InvalidBlogDataErrorPayload, parsingError: ZodError) {
    super(
      data,
      "INVALID_BLOG_DATA",
      `The blog collection data provided is invalid.\n\n${z.prettifyError(parsingError)}`,
    );
  }

  public override toAPIError(): APIError<object> {
    return new APIError(400, this.code, this.message, this.data);
  }
}

export default InvalidBlogDataError;
