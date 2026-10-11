import APIError from "src/utility/errors/APIError";
import CodeError from "src/utility/errors/CodeError";

class AuthRequiredError extends CodeError<"AUTH_REQUIRED"> {
  public constructor(options?: ErrorOptions) {
    super("AUTH_REQUIRED", "Authentication is required to access this resource.", options);
  }

  public override toAPIError(): APIError<never, "AUTH_REQUIRED"> {
    return new APIError(401, this.code, this.message);
  }
}

export default AuthRequiredError;
