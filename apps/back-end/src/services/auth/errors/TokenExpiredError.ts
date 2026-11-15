import type { JWTPayload } from "jose";

import APIError from "src/utility/errors/APIError";
import DataError from "src/utility/errors/DataError";

export interface TokenExpiredErrorPayload {
  payload: JWTPayload;
}

class TokenExpiredError extends DataError<TokenExpiredErrorPayload> {
  public constructor(data: TokenExpiredErrorPayload, options?: ErrorOptions) {
    super(data, "TOKEN_EXPIRED", "The token has expired.", options);
  }

  public override toAPIError(): APIError<TokenExpiredErrorPayload> {
    return new APIError(400, this.code, this.message, this.data);
  }
}

export default TokenExpiredError;
