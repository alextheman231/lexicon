import APIError from "src/utility/errors/APIError";
import DataError from "src/utility/errors/DataError";

export interface ForbiddenAccessErrorPayload {
  userId?: string;
}

class ForbiddenAccessError extends DataError<ForbiddenAccessErrorPayload, "FORBIDDEN_ACCESS"> {
  public constructor(data: ForbiddenAccessErrorPayload, options?: ErrorOptions) {
    super(data, "FORBIDDEN_ACCESS", "You do not have permission to access this resource.", options);
  }

  public override toAPIError(): APIError<ForbiddenAccessErrorPayload, "FORBIDDEN_ACCESS"> {
    return new APIError(403, this.code, this.message, this.data);
  }
}

export default ForbiddenAccessError;
