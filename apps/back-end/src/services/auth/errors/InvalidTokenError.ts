import type { JWTPayload } from "jose";

import APIError from "src/utility/errors/APIError";
import DataError from "src/utility/errors/DataError";

interface InvalidTokenErrorPayload {
  payload: JWTPayload | null;
}

class InvalidTokenError extends DataError<InvalidTokenErrorPayload> {
  public constructor(data: InvalidTokenErrorPayload, options?: ErrorOptions) {
    super(data, "INVALID_TOKEN", "The token provided is invalid.", options);
  }

  public override toAPIError(): APIError<InvalidTokenErrorPayload> {
    return new APIError(400, this.code, this.message, this.data);
  }
}

export default InvalidTokenError;
